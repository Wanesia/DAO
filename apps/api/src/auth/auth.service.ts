import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userDto: { email: string; password: string }) {
    try {
      const user = await this.userService.findUserByEmail(userDto.email);
      if (user) {
        throw new ConflictException('Email already in use');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userDto.password, salt);

      return await this.userService.createUser({
        ...userDto,
        password: hashedPassword,
        authProvider: 'local',
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error registering user:', error);

      throw new Error(
        'An unexpected error occurred while registering the user',
      );
    }
  }
  async createFacebookUser(userData: {
    email: string;
    name: string;
    surname: string;
    authProvider: string;
    facebookId: string;
  }) {
    try {
      return await this.userService.createUser({
        ...userData,
      });
    } catch (error) {
      console.error('Error creating Facebook user:', error);
      throw new Error('Failed to create Facebook user');
    }
  }

  async validateUser({ email, password }: AuthPayloadDto) {
    try {
      const user = await this.userService.findUserByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (user && isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }

      throw new BadRequestException('Invalid email or password');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Invalid email or password');
      } else {
        throw error;
      }
    }
  }

  async login(
    user: any,
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    const { password, ...userData } = user._doc;
    // Update lastSeen for the user whenever they log in
    await this.userService.updateUser(userData._id, {
      lastSeen: new Date(),
    });
    const payload = { userId: userData._id };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: userData,
    };
  }
}
