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
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { ImageUploadModule } from 'src/imageUpload/imageUpload.module';

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
    const uploadResult = await this.imageUploadService.uploadImage(image, 'ensembles');
    imageUrl = uploadResult.secure_url;
  }

  const ensembleDto: CreateEnsembleDto = {
    ...formData,
    location: {
      city: formData.city,
      postCode: formData.postcode,
    },
    genres: Array.isArray(formData.genres) ? formData.genres : JSON.parse(formData.genres),
    type: formData.type,
    imageUrl: imageUrl,
  };

  return this.ensembleService.createEnsemble(ensembleDto, creatorId);
}



  @Get()
  async findAll(): Promise<Ensemble[]> {
    return this.ensembleService.findAll();
  }

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
}
