import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ensemble } from './schema/ensemble.schema';

@Injectable()
export class EnsembleService {
  constructor(@InjectModel(Ensemble.name) private ensembleModel: Model<Ensemble>) {}

  async createEnsemble(ensembleDto: any): Promise<Ensemble> {
    try {
      const newEnsemble = new this.ensembleModel(ensembleDto);
      return await newEnsemble.save();
    } catch (error) {
      console.error('Error creating ensemble:', error);
      throw new Error('Failed to create ensemble.');
    }
  }

  async findAll(): Promise<Ensemble[]> {
    try {
      return await this.ensembleModel.find().exec();
    } catch (error) {
      console.error('Error retrieving ensembles:', error);
      throw new Error('Failed to retrieve ensembles.');
    }
  }

  async updateEnsemble(id: string, ensembleDto: any): Promise<Ensemble> {
    try {
      const updatedEnsemble = await this.ensembleModel.findByIdAndUpdate(id, ensembleDto, {
        new: true,
        useFindAndModify: false,
      });

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
}
