import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InstrumentName, Genre } from '@shared/enums';

@Schema()
export class Instrument {
  @Prop({ type: String, enum: InstrumentName, required: true })
  name: InstrumentName;

  @Prop({ type: Number, min: 1, max: 6, required: true })
  level: number;

  @Prop({ type: [String], enum: Genre})
  genres: Genre[];
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
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    required: function () {
      return this.authProvider === 'local'; // Password ONLY required for local auth
    },
  })
  password?: string;

  @Prop({ default: 'local', enum: ['local', 'facebook'] })
  authProvider: string;

  @Prop()
  phone: string;

  @Prop({ type: Location })
  location: Location;

  @Prop({ default: Date.now, immutable: true })
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

  @Prop({ type: Instrument })
  instrument: Instrument;

  @Prop({ type: [Types.ObjectId], ref: 'Ensemble' })
  ensembleIds: Types.ObjectId[];

  @Prop()
  facebookId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
