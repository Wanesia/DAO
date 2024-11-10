import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MusicianCount, PracticeFrequency, EnsembleType, Genre } from '@shared/enums';

@Schema()
export class Location {
  @Prop()
  city: string;

  @Prop() 
  postCode: string;
}

@Schema()
export class Ensemble extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  imageUrl: string;

  @Prop()
  description: string;

  @Prop()
  homepageUrl: string;

  @Prop({ type: Location})
  location: Location;

  @Prop({ type: String, enum: MusicianCount, required: true })
  number_of_musicians: MusicianCount;

  @Prop({ type: String, enum: PracticeFrequency, required: true })
  practice_frequency: PracticeFrequency;

  @Prop({ type: [String], enum: Genre, required: true })
  genres: Genre[];

  @Prop({ type: [String], enum: EnsembleType, required: true })
  type: EnsembleType[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  member_ids: Types.ObjectId[];
}

export const EnsembleSchema = SchemaFactory.createForClass(Ensemble);
