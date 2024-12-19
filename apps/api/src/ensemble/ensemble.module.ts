
import { Module } from '@nestjs/common';
import { EnsembleController } from './ensemble.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ensemble, EnsembleSchema } from './schema/ensemble.schema';
import { EnsembleService } from './ensemble.service';
import { ImageUploadModule } from '../imageUpload/imageUpload.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Ensemble.name, schema: EnsembleSchema }]),
    ImageUploadModule,
  ],
  controllers: [EnsembleController],
  providers: [EnsembleService],
  exports: [EnsembleService] 
})
export class EnsembleModule {};