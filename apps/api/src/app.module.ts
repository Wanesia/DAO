import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EnsembleModule } from './ensemble/ensemble.module';
import { AuthModule } from './auth/auth.module';
import * as bcrypt from 'bcrypt';
import { FacebookStrategy } from './auth/strategies/facebook.strategy';
import { ImageUploadModule } from './imageUpload/imageUpload.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/dao'),
    UserModule,
    EnsembleModule,
    AuthModule,
    PostModule,
    ImageUploadModule,
    ConfigModule.forRoot({
      isGlobal: true, // makes config available throughout the app
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'BCRYPT_SERVICE',
      useValue: bcrypt,
    },
  ],
})
export class AppModule {}
