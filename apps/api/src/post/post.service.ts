import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { Model, Types, isValidObjectId } from 'mongoose';
import { InstrumentName } from '@shared/enums';
import { CreatePostDto } from './dto/post.dto';
import { EnsembleService } from '../ensemble/ensemble.service';
import { HydratedDocument } from 'mongoose';
import { Post as PostType, PostWithEnsembleDTO } from '@shared/types';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private ensembleService: EnsembleService,
  ) {}

  async searchPosts(
    searchTerm: string,
    page: number,
    limit: number,
    instrumentName?: InstrumentName,
    location?: string,
  ): Promise<{ data: Post[]; total: number }> {
    let aggregationPipeline = [];

    console.log('Search term:', searchTerm);
    if (searchTerm && searchTerm.trim()) {
      aggregationPipeline.push({ $match: {} }); 
    }

    aggregationPipeline.push({
      $lookup: {
        from: 'ensembles',
        let: { ensembleObjId: { $toObjectId: '$ensemble' } },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$ensembleObjId'] } } }],
        as: 'ensembleData',
      },
    });

    aggregationPipeline.push({
      $unwind: {
        path: '$ensembleData',
        preserveNullAndEmptyArrays: true,
      },
    });

    if (searchTerm && searchTerm.trim()) {
      aggregationPipeline.push({
        $match: {
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { 'ensembleData.name': { $regex: searchTerm, $options: 'i' } },
          ],
        },
      });
    }

    if (instrumentName) {
      aggregationPipeline.push({
        $match: {
          'instrument.name': instrumentName,
        },
      });
    }

    if (location && location.trim()) {
      if (/^\d+$/.test(location)) {
        aggregationPipeline.push({
          $match: { 'location.postCode': location },
        });
      } else {
        aggregationPipeline.push({
          $match: {
            'location.city': { $regex: new RegExp(location, 'i') },
          },
        });
      }
    }

    aggregationPipeline.push({
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        location: 1,
        instrument: 1, 
        ensemble: {
          _id: '$ensembleData._id',
          name: '$ensembleData.name',
          imageUrl: '$ensembleData.imageUrl',
          number_of_musicians: '$ensembleData.number_of_musicians',
        },
      },
    });

    aggregationPipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    try {
      const data = await this.postModel.aggregate(aggregationPipeline);

      const countPipeline = [...aggregationPipeline];
      countPipeline.splice(-2, 2);
      countPipeline.push({ $count: 'total' });
      const totalResults = await this.postModel.aggregate(countPipeline);
      const total = totalResults[0]?.total || 0;

      return { data, total };
    } catch (error) {
      console.error('Error retrieving posts:', error);
      throw new Error('Failed to retrieve posts.');
    }
  }

  async findByUser(userId: string): Promise<Post[]> {
    try {
      const userEnsembles = await this.ensembleService.findByCreator(userId);
      const ensembleIds = userEnsembles.map((ensemble) => ensemble._id);

      if (ensembleIds.length === 0) {
        return [];
      }

      const aggregationPipeline = [
        {
          $match: {
            ensemble: { $in: ensembleIds },
          },
        },
        {
          $lookup: {
            from: 'ensembles',
            let: { ensembleObjId: { $toObjectId: '$ensemble' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$ensembleObjId'] } } },
            ],
            as: 'ensembleData',
          },
        },
        { $unwind: '$ensembleData' },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            location: 1,
            instrument: 1,
            ensemble: {
              _id: '$ensembleData._id',
              name: '$ensembleData.name',
              imageUrl: '$ensembleData.imageUrl',
              number_of_musicians: '$ensembleData.number_of_musicians',
            },
          },
        },
      ];

      return this.postModel.aggregate(aggregationPipeline);
    } catch (error) {
      console.error('Error fetching posts by creator:', error);
      throw new Error('Failed to fetch posts by creator.');
    }
  }

  async getById(postId: string): Promise<any> {
    try {
      const post = await this.postModel
        .findById(postId)
        .populate('ensemble', 'name imageUrl number_of_musicians member_ids creator')
        .lean();

      return post;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw new Error('Failed to fetch post by ID.');
    }
  }

  async findByEnsembleId(ensembleId: string): Promise<Post[]> {
    if (!Types.ObjectId.isValid(ensembleId)) {
      throw new Error('Invalid ensemble ID.');
    }
  
    try {
      const posts = await this.postModel
        .find({ ensemble: new Types.ObjectId(ensembleId) })
        .populate('ensemble', 'name imageUrl number_of_musicians');
  
      return posts;
    } catch (error) {
      console.error('Error fetching posts by ensemble ID:', error);
      throw new Error('Failed to fetch posts by ensemble ID.');
    }
  }
  

  async createPost(
    postDto: CreatePostDto,
  ): Promise<{ success: boolean; post?: Post; error?: string }> {
    try {
      const postData = {
        ...postDto,
        ensemble: new Types.ObjectId(postDto.ensembleId),
      };

      const newPost = new this.postModel(postData);
      const savedPost = await newPost.save();
      return { success: true, post: savedPost };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          error: 'A post with this title already exists',
        };
      }
      console.error('Error creating post:', error);
      throw new Error('Failed to create post.');
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      const result = await this.postModel.findByIdAndDelete(postId);
      if (!result) {
        throw new Error('Post not found');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error('Failed to delete post. Please try again later.');
    }
  }
}
