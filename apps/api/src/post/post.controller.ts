import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { InstrumentName } from '@shared/enums';
import { Post as PostSchema } from './schema/post.schema';
import { PostService } from './post.service';
import {
  Controller,
  UseGuards,
  Body,
  Post,
  Req,
  Delete,
  Get,
  Query,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { CreatePostDto } from './dto/post.dto';
import { AuthenticatedRequest, Post as PostType} from '@shared/types';


@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findPosts(
    @Query('searchTerm') searchTerm: string = '',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 6,
    @Query('instrumentName') instrumentName?: InstrumentName,
    @Query('location') location?: string,
  ): Promise<{ data: PostSchema[]; total: number }> {
    return this.postService.searchPosts(
      searchTerm,
      +page,
      +limit,
      instrumentName,
      location,
    );
  }
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async findPostsByUser(
    @Req() req: AuthenticatedRequest,
    @Query('userId') userId?: string,
  ): Promise<PostSchema[]> {
    try {
        console.log('Request user:', req.user);
      const creatorId = userId || req.user.userId;
      console.log('Request user:', req.user);
      console.log('Creator ID:', creatorId);
      const posts = await this.postService.findByUser(creatorId);
      return posts;
    } catch (error) {
      console.error('Error fetching ensembles by creator:', error);
      throw new InternalServerErrorException(
        'Failed to fetch ensembles by creator. Please try again.',
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findPostById(@Param('id') id: string): Promise<PostSchema[]> {
    console.log('Find post by ID:', id);
    return this.postService.getById(id);
  }

  @Get('ensemble/:id')
  @UseGuards(JwtAuthGuard)
  async findByEnsembleId(@Param('id') id: string) : Promise<PostSchema[]> {
    return this.postService.findByEnsembleId(id);
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPostDto: CreatePostDto,
  ): Promise<{ success: boolean; post?: PostSchema; error?: string }> {
    console.log('Create post endpoint hit');
    console.log('Form data ensembleId type:', typeof createPostDto.ensembleId);
    console.log('Form data ensembleId:', createPostDto.ensembleId);
    try {
      const result = await this.postService.createPost(createPostDto);
      console.log('Post created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteEnsemble(@Param('id') id: string) {
    try {
      await this.postService.deletePost(id);
    } catch (error) {
      console.error('Error deleting ensembles by creator:', error);
      throw new InternalServerErrorException(
        'Failed to delete ensembles by creator. Please try again.',
      );
    }
  }
}
