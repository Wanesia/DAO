import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './schema/user.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/updateProfile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userDto: any): Promise<User> {
    return this.usersService.createUser(userDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    const userId = req.user.userId;
    const user = await this.usersService.findUserById(userId);
    return user;
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findUserByEmail(email);
  }
  @Patch(':email')
  async updateProfile(@Param('email') email: string, @Body() userDto: UpdateProfileDto): Promise<User> {
    return this.usersService.updateUserByEmail(email, userDto);
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() userDto: any): Promise<User> {
    return this.usersService.updateUser(id, userDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
