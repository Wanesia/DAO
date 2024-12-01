import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ensemble } from './schema/ensemble.schema';
import { CreateEnsembleDto } from './dto/ensemble.dto';
import { Types } from 'mongoose';
import {
  Genre,
  JoinRequestStatus,
} from '@shared/enums';

@Injectable()
export class EnsembleService {
  constructor(
    @InjectModel(Ensemble.name) private ensembleModel: Model<Ensemble>,
  ) {}

  async createEnsemble(
    ensembleDto: CreateEnsembleDto,
    creatorId: string,
  ): Promise<Ensemble> {
    const existingEnsemble = await this.ensembleModel.findOne({
      name: ensembleDto.name,
    });
    if (existingEnsemble) {
      throw new Error('Ensemble with this name already exists');
    }
  
    try {
      const ensembleData = {
        ...ensembleDto,
        creator: creatorId,
        member_ids: [
          creatorId,
        ],
      };
      console.log('Ensemble data:', ensembleData);
  
      const newEnsemble = await this.ensembleModel.create(ensembleData);
      return newEnsemble;
    } catch (error) {
      console.error('Error creating ensemble:', error);
      throw new Error('Failed to create ensemble.');
    }
  }
  

  async searchEnsembles(
    searchTerm: string,
    page: number,
    limit: number,
    genre?: Genre,
    location?: string,
  ): Promise<{ data: Ensemble[]; total: number }> {
    let query: Record<string, any> = {};

    // using regex to search for partial match - parts of words, options 'i' makes it case-insensitive
    if (searchTerm && searchTerm.trim()) {
      query = { name: { $regex: searchTerm, $options: 'i' } };
    }

    // checking whether provided genre is in the genres array
    if (genre) {
      query.genres = { $in: [genre] };
    }

    if (location && location.trim()) {
      if (/^\d+$/.test(location)) {
        query['location.postCode'] = location;
      } else {
        query['location.city'] = { $regex: new RegExp(location, 'i') }; 
      }
    }

    console.log('Query passed to search:', query);

    try {
      const total = await this.ensembleModel.countDocuments(query).exec();
      const data = await this.ensembleModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      return { data, total };
    } catch (error) {
      console.error('Error searching ensembles:', error);
      throw new Error('Failed to search ensembles.');
    }
  }

  async updateEnsemble(id: string, ensembleDto: any): Promise<Ensemble> {
    try {
      const updatedEnsemble = await this.ensembleModel.findByIdAndUpdate(
        id,
        ensembleDto,
        {
          new: true,
          useFindAndModify: false,
        },
      );

      if (!updatedEnsemble) {
        throw new Error('Ensemble not found');
      }

      return updatedEnsemble;
    } catch (error) {
      console.error('Error updating ensemble:', error);
      throw new Error('Failed to update ensemble. Please try again later.');
    }
  }

  async deleteEnsemble(id: string): Promise<void> {
    try {
      const result = await this.ensembleModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Ensemble not found');
      }
    } catch (error) {
      console.error('Error deleting ensemble:', error);
      throw new Error('Failed to delete ensemble. Please try again later.');
    }
  }
  async createJoinRequest(ensembleId: string, userId: string) {
    const ensemble = await this.ensembleModel.findById(ensembleId);
    if (!ensemble) throw new NotFoundException('Ensemble not found');

    // Check if there's already a pending request
    const existingRequest = ensemble.joinRequests.find(
      (request) => request.userId === userId,
    );
    if (existingRequest) {
      throw new Error('Join request already exists');
    }

    // Add the join request
    ensemble.joinRequests.push({ userId, status: JoinRequestStatus.PENDING });
    await ensemble.save();
    return { message: 'Join request created successfully' };
  }

  async getJoinRequests(ensembleId: string) {
    const ensemble = await this.ensembleModel.findById(ensembleId);
    if (!ensemble) throw new NotFoundException('Ensemble not found');
    return ensemble.joinRequests;
  }
  async updateJoinRequestStatus(
    ensembleId: string,
    userId: string,
    status: JoinRequestStatus,
  ) {
    const ensemble = await this.ensembleModel.findById(ensembleId);
    if (!ensemble) throw new NotFoundException('Ensemble not found');

    const joinRequest = ensemble.joinRequests.find(
      (request) => request.userId === userId,
    );
    if (!joinRequest) throw new NotFoundException('Join request not found');

    // Update the status
    joinRequest.status = status;
    await ensemble.save();
    return { message: `Join request ${status.toLowerCase()} successfully` };
  }
  async deleteJoinRequest(ensembleId: string, userId: string): Promise<void> {
    const result = await this.ensembleModel.updateOne(
      { _id: ensembleId },
      { $pull: { joinRequests: { userId } } },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException('Join request not found or already deleted.');
    }
  }
  async findById(ensembleId: string): Promise<any> {
    try {
      const ensemble = await this.ensembleModel.findById(ensembleId);

      if (!ensemble) {
        throw new NotFoundException(`Ensemble with ID ${ensembleId} not found`);
      }
      return ensemble;
    } catch (error) {
      console.error(`Error finding ensemble by ID: ${ensembleId}`, error);
      throw new InternalServerErrorException(
        'An error occurred while retrieving the ensemble.',
      );
    }
  }
  async addMember(ensembleId: string, userId: string): Promise<Ensemble> {
    const ensemble = await this.ensembleModel.findById(ensembleId);
    if (!ensemble) {
      throw new NotFoundException(`Ensemble with ID ${ensembleId} not found`);
    }
    const userIdAsObjectId = new Types.ObjectId(userId);

    // Check if user is already a member to avoid duplicates
    if (ensemble.member_ids.includes(userIdAsObjectId)) {
      throw new BadRequestException(`User is already a member of this ensemble`);
    }
    // Add userId to member_ids and remove from joinRequests
    ensemble.member_ids.push(userIdAsObjectId);
    ensemble.joinRequests = ensemble.joinRequests.filter(
      (request) => request.userId !== userId,
    );
  
    await ensemble.save();
    return ensemble;
  }

  async findByCreator(creatorId: string): Promise<Ensemble[]> {
    try {
      const ensembles = await this.ensembleModel.find({ creator: creatorId }).exec();
  
      if (!ensembles || ensembles.length === 0) {
        throw new NotFoundException('No ensembles found for this creator');
      }
  
      return ensembles;
    } catch (error) {
      console.error(`Error finding ensembles by creator ID: ${creatorId}`, error);
      throw new InternalServerErrorException(
        'An error occurred while retrieving the ensembles.',
      );
    }
  }
  
  
}
