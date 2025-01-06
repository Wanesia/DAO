import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EnsembleModule } from "src/ensemble/ensemble.module";
import { Post, PostSchema } from "./schema/post.schema";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        UserModule,
        EnsembleModule,
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {} 