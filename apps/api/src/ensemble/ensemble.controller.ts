import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EnsembleService } from './ensemble.service';
import { Ensemble } from './schema/ensemble.schema';
import { CreateEnsembleDto } from './dto/ensemble.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ImageUploadService } from 'src/imageUpload/imageUpload.service';
import { UseInterceptors, HttpException, HttpStatus, UploadedFile, Query  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Genre, JoinRequestStatus } from '@shared/enums';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    accessToken: string;
  };
}

@Controller('ensembles')
export class EnsembleController {
  constructor(
    private readonly ensembleService: EnsembleService,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() formData: any,
    @Req() req: AuthenticatedRequest,
  ): Promise<Ensemble> {
    const creatorId = req.user.id;
  
    let imageUrl: string | undefined;
    if (image) {
      const uploadResult = await this.imageUploadService.uploadImage(
        image,
        'ensembles',
      );
      imageUrl = uploadResult.secure_url;
    }
  
    const ensembleDto: CreateEnsembleDto = {
      ...formData,
      location: {
        city: formData.city,
        postCode: formData.postcode,
      },
      genres: Array.isArray(formData.genres)
        ? formData.genres
        : JSON.parse(formData.genres),
      type: formData.type,
      image: imageUrl,
    };
  
    try {
      return await this.ensembleService.createEnsemble(ensembleDto, creatorId);
    } catch (error) {
      if (error.message === 'Ensemble with this name already exists') {
        throw new HttpException(
          'Ensemble name must be unique',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to create ensemble',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findEnsembles(
    @Query('searchTerm') searchTerm: string = '',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 6,
    @Query('genre') genre?: Genre
  ): Promise<{ data: Ensemble[]; total: number }> {
    return this.ensembleService.searchEnsembles(searchTerm, page, limit, genre);
  };
  

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() ensembleDto: any,
  ): Promise<Ensemble> {
    return this.ensembleService.updateEnsemble(id, ensembleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.ensembleService.deleteEnsemble(id);
  }

  @Post('join/:ensembleId')
  async createJoinRequest(@Param('ensembleId') ensembleId: string, @Body('userId') userId: string) {
    return this.ensembleService.createJoinRequest(ensembleId, userId);
  }

  @Get('join/:ensembleId')
  async getJoinRequests(@Param('ensembleId') ensembleId: string) {
    return this.ensembleService.getJoinRequests(ensembleId);
  }

  @Patch('join/:ensembleId/:userId')
  async updateJoinRequestStatus(
    @Param('ensembleId') ensembleId: string,
    @Param('userId') userId: string,
    @Body('status') status: JoinRequestStatus,
  ) {
    return this.ensembleService.updateJoinRequestStatus(ensembleId, userId, status);
  }

  @Delete('join/:ensembleId/:userId')
  async deleteJoinRequest(
    @Param('ensembleId') ensembleId: string,
    @Param('userId') userId: string
  ): Promise<void> {
    await this.ensembleService.deleteJoinRequest(ensembleId, userId);
  }

}
