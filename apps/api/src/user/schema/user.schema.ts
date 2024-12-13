import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InstrumentName, Genre } from '@shared/enums';

@Schema()
export class Instrument {
  @Prop({ type: String, enum: InstrumentName, required: true })
  name: InstrumentName;

  @Prop({ type: Number, min: 1, max: 6, required: true })
  level: number;

  @Prop({ type: [String], enum: Genre })
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

  @Prop({ 
    required: true, 
    unique: true,
    default: function(this: User) {
      if (this.name && this.surname) {
        const uniqueId = Math.random().toString(36).substring(2, 8);
        const nameSlug = `${this.name}-${this.surname}`.toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        return `${nameSlug}-${uniqueId}`;
      }
      return undefined;
    }
  })
  slug: string;

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

  @Prop({ type: [Instrument], default: [] })
  instruments: Instrument[];

  @Prop({ type: [Types.ObjectId], ref: 'Ensemble' })
  ensembleIds: Types.ObjectId[];

  @Prop()
  facebookId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
