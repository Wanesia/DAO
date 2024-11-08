import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/dao'),
    UserModule,
    AuthModule,
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
