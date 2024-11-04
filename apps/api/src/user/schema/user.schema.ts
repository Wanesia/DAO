import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop({
    type: {
      city: { type: String },
      postCode: { type: String },
    },
  })
  location: {
    city: string;
    postCode: string;
  };

  @Prop()
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

  @Prop({
    type: {
      name: { type: String},
      level: {
        number: { type: Number},
        description: { type: String},
      },
    },
  })
  instrument: {
    name: string;
    level: {
      number: number;
      description: string;
    };
  };

  @Prop({ type: [Types.ObjectId], ref: 'Ensemble' })
  ensembleIds: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
