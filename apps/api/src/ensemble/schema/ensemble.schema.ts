import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  MusicianCount,
  PracticeFrequency,
  EnsembleType,
  Genre,
} from '@shared/enums';

@Schema()
export class Location {
  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  postCode: string;
}

@Schema()
export class Ensemble extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    validate: {
      validator: (value: string) => 
        value === "" || /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value),
      message: 'Invalid URL format',
    },
    default: "", 
  })
  homepageUrl: string;
  

  @Prop({ type: Location, required: true })
  location: Location;

  @Prop({ type: String, enum: Object.values(MusicianCount), required: true })
  number_of_musicians: MusicianCount;
  
  @Prop({ type: String, enum: Object.values(PracticeFrequency), required: true })
  practice_frequency: PracticeFrequency;
  
  @Prop({ type: [String], enum: Object.values(Genre), required: true })
  genres: Genre[];
  
  @Prop({ type: String, enum: Object.values(EnsembleType), required: true })
  type: EnsembleType;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
    validate: {
      validator: (value: Types.ObjectId[]) => value.length > 0,
      message: 'Ensemble must have at least one member',
    },
  })
  member_ids: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId; 
}

export const EnsembleSchema = SchemaFactory.createForClass(Ensemble);

// should be modified for search functionality later
EnsembleSchema.index({ name: "text" });
EnsembleSchema.index({ name: 1 });
EnsembleSchema.index({ genre: 1 });
