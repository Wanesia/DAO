import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

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

  async validateUser({ email, password }: AuthPayloadDto) {
    try {
      const user = await this.userService.findUserByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (user && isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }

      throw new UnauthorizedException('Invalid email or password');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid email or password');
      } else {
        throw error;
      }
    }
  }
  async login(user: any) {
    const payload = { userId: user._doc._id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken};
  }
}
