import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
class InstrumentLevel {
  @Prop({ type: Number})
  number: number;

  @Prop({ type: String})
  description: string;
}

@Schema()
class Instrument {
  @Prop({ type: String})
  name: string;

  @Prop({ type: InstrumentLevel})
  level: InstrumentLevel;
}
@Schema()
export class Location {
  @Prop()
  city: string;

  @Prop() 
  postCode: string;
}
@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({required: true })
  name: string;

  @Prop({required: true })
  surname: string;

  @Prop({required: true ,unique: true })
  email: string;

  @Prop({required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop({ type: Location})
  location: Location;

  @Prop({default: Date.now, immutable: true })
  createdAt: Date;

  @Prop()
  lastSeen: Date;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  profileText: string;

  @Prop()
  profilePicture: string;

  @Prop()
  isSeeking: boolean;

  @Prop()
  isSubscribedToNewsletter: boolean;

  @Prop({ type: Instrument})
  instrument: Instrument;

  @Prop({ type: [Types.ObjectId], ref: 'Ensemble' })
  ensembleIds: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
