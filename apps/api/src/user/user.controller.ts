import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './schema/user.schema';


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

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User>{
    return this.usersService.findUserByEmail(email);
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
