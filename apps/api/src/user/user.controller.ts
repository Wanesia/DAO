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
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common';
import { UsersService } from './user.service';
import { Instrument, User } from './schema/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ImageUploadService } from '../imageUpload/imageUpload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddInstrumentDto } from './dto/add-instrument.dto';
import { LastSeenInterceptor } from 'src/interceptors/lastSeen.interceptor';

@Controller('users')
// @UseInterceptors(LastSeenInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @Post()
  async create(@Body() userDto: any): Promise<User> {
    return this.usersService.createUser(userDto);
  }

  @Get()
  async findAll(
    @Query('searchTerm') searchTerm: string = '',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 6,
    @Query('instrument') instrument?: Instrument,
  ): Promise<{ data: User[]; total: number }> {
    return this.usersService.searchUsers(searchTerm, page, limit, instrument);
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
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @Param('email') email: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() userDto: any,
  ): Promise<User> {
    let profilePictureUrl: string | undefined;
    if (image) {
      const uploadResult = await this.imageUploadService.uploadImage(
        image,
        'profile',
      );
      profilePictureUrl = uploadResult.secure_url;
    }

    const updateData = {
      ...userDto,
      profilePicture: profilePictureUrl,
    };
    return this.usersService.updateUserByEmail(email, updateData);
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() userDto: any): Promise<User> {
    return this.usersService.updateUser(id, userDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Patch('instruments/:email')
  async addInstrument(
    @Param('email') email: string,
    @Body() instrument: AddInstrumentDto,
  ) {
    return this.usersService.addInstrument(email, instrument);
  }
  @Patch('/:email/instruments/delete')
  async deleteInstrumentByEmail(
    @Param('email') email: string,
    @Body() body: { index: number },
  ) {
    return this.usersService.deleteInstrument(email, body.index);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }
}
