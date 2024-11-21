import { Module } from '@nestjs/common';
import { ImageUploadService } from './imageUpload.service';
import { CloudinaryProvider } from './cloudinary.provider';


@Module({
  providers: [ImageUploadService, CloudinaryProvider],
  exports: [ImageUploadService],
})
export class ImageUploadModule {}
