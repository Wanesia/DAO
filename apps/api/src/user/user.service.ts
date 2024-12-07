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
import { UpdateSettingsDto } from './dto/settings.dto';
import * as bcrypt from 'bcrypt';

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
      const updatedUser = await this.userModel.findOneAndUpdate(
        { email: email },
        userDto,
        {
          new: true,
          runValidators: true, // run schema validators
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
  async updateSettings(
    id: string,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<User> {
    try {
      const { password, newPassword, isSubscribedToNewsletter } =
        updateSettingsDto;
      const user = await this.userModel.findById(id);
      console.log(user);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Validate and hash password if both currend password and newPassword are provided
      if (password || newPassword) {
        if (!password || !newPassword) {
          throw new Error(
            'Both current and new passwords are required to change the password',
          );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Current password is incorrect');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        updateSettingsDto.password = hashedPassword;
      }

      const updateFields: UpdateSettingsDto = {};

      if (isSubscribedToNewsletter !== undefined) {
        updateFields.isSubscribedToNewsletter = isSubscribedToNewsletter;
      }

      if (newPassword) {
        updateFields.password = updateSettingsDto.password;
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateFields,
        {
          new: true,
          runValidators: true,
        },
      );
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updatedUser;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw new Error(
        'Failed to update user settings. Please try again later.',
      );
    }
  }
}
