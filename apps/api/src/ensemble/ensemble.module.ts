
import { Module } from '@nestjs/common';
import { EnsembleController } from './ensemble.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ensemble, EnsembleSchema } from './schema/ensemble.schema';
import { EnsembleService } from './ensemble.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ensemble.name, schema: EnsembleSchema }]),
  ],
  controllers: [EnsembleController],
  providers: [EnsembleService],
})
export class EnsembleModule {}