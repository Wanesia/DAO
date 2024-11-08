import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userDto: any): Promise<User> {
    try {
      const newUser = new this.userModel(userDto);
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user.');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw new Error('Failed to retrieve users.');
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email }).exec();

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return user;
    } catch (error) {
      console.error('Error retrieving user:', error);
    }
  }

  async updateUser(id: string, userDto: any): Promise<User> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, userDto, {
        new: true,
        useFindAndModify: false,
      });

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user. Please try again later.');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const result = await this.userModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user. Please try again later.');
    }
  }
}
