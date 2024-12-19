import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { Instrument, Location } from "src/user/schema/user.schema";

@Schema({timestamps: true})
export class Post extends Document {
    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({
        type: Types.ObjectId, ref: 'Ensemble',
        required: true,
    })
    ensemble: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Instrument',
        required: true,
     })
     instrument: Instrument;

     @Prop({ required: true, ref: 'Location' })
     location: Location;

     createdAt: Date; 

}

export const PostSchema = SchemaFactory.createForClass(Post);
