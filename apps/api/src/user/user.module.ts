import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UsersService } from './user.service';
import { ImageUploadModule } from 'src/imageUpload/imageUpload.module';

@Module({
  imports: [ImageUploadModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UserModule {}