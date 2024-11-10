import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MusicianCount, PracticeFrequency, EnsembleType, Genre } from '@shared/enums';

@Schema()
export class Ensemble extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  photo: string;

  @Prop()
  description: string;

  @Prop()
  homepage: string;

  @Prop()
  location: string;

  @Prop({ type: String, enum: MusicianCount, required: true })
  number_of_musicians: MusicianCount;

  @Prop({ type: String, enum: PracticeFrequency, required: true })
  practice_frequency: PracticeFrequency;

  @Prop({ type: [String], enum: Genre, required: true })
  genres: Genre[];

  @Prop({ type: [String], enum: EnsembleType })
  type: EnsembleType[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  member_ids: Types.ObjectId[];
}

export const EnsembleSchema = SchemaFactory.createForClass(Ensemble);
