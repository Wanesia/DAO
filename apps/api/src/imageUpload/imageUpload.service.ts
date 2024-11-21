// image-upload.service.ts
import { Injectable, BadRequestException, Inject, Logger } from '@nestjs/common';
import { UploadApiResponse, UploadApiOptions } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class ImageUploadService {
  private readonly logger = new Logger(ImageUploadService.name);
  private uploader: typeof cloudinary.uploader;

  constructor(private readonly cloudinaryProvider) {
    this.uploader = this.cloudinaryProvider.getUploader();
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'default_folder',
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type.');
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      throw new BadRequestException('File size exceeds the allowed limit of 5MB.');
    }

    const uploadOptions: UploadApiOptions = {
      folder,
      resource_type: 'auto',
    };

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          this.logger.error('Cloudinary upload failed', error);
          return reject(new BadRequestException('File upload failed.'));
        }
        this.logger.log(`File uploaded successfully: ${result.secure_url}`);
        resolve(result);
      });

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
