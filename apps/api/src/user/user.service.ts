import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instrument, User } from './schema/user.schema';
import { UpdateProfileDto } from './dto/updateProfile.dto';

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

  async searchUsers(
    searchTerm: string,
    page: number,
    limit: number,
    instrument: Instrument,
  ): Promise<{ data: User[]; total: number }> {
    let query: Record<string, any> = {};
    // using regex to search for partial match - parts of words, options 'i' makes it case-insensitive
    if (searchTerm && searchTerm.trim()) {
      query = { name: { $regex: searchTerm, $options: 'i' } };
    }

    // checking whether provided instrument is in the genres array
    if (instrument) {
      query['instruments.name']  = { $in: [instrument] };
    }

    console.log('Query passed to search:', query);

    try {
      const total = await this.userModel.countDocuments(query).exec();
      const data = await this.userModel
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
  async findUserById(userId: string): Promise<any> {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('-password -__v')
        .lean();

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return user;
    } catch (error) {
      console.error(`Error finding user by ID: ${userId}`, error);

      throw new InternalServerErrorException(
        'An error occurred while retrieving the user.',
      );
    }
  }

  async findBySlug(slug: string): Promise<User | null> {
    return this.userModel.findOne({ slug }).exec();
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
  async updateUserByEmail(
    email: string,
    userDto: UpdateProfileDto,
  ): Promise<User> {
    try {
      console.log('Updating user:', email, userDto);
      const updateData: any = { ...userDto };
      if (userDto.city || userDto.postcode) {
        updateData.location = {
          city: userDto.city,
          postCode: userDto.postcode,
        };
        delete updateData.city;
        delete updateData.postCode;
      }

      const updatedUser = await this.userModel.findOneAndUpdate(
        { email },
        updateData,
        {
          new: true, 
          runValidators: true, 
        },
      );

      if (!updatedUser) {
        throw new NotFoundException(`User with email ${email} not found`);
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
  async addInstrument(email: string, newInstrument: Instrument): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    user.instruments.push(newInstrument);
    return user.save();
  }
  async deleteInstrument(email: string, index: number): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    if (index < 0 || index >= user.instruments.length) {
      throw new BadRequestException('Invalid instrument index');
    }

    user.instruments.splice(index, 1);
    await user.save();
    return user;
  }

  async updateLastSeen(userId: string): Promise<void> {
    try {
      await this.userModel.findByIdAndUpdate(userId, {
        lastSeen: new Date(),
      });
    } catch (error) {
      console.error(`Failed to update lastSeen for user ${userId}:`, error);
      throw new Error('Could not update lastSeen');
    }
  }
}
