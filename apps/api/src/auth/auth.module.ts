import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ConfigService } from '@nestjs/config';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions:{
          expiresIn: config.get<string>('JWT_EXPIRES_IN')
        }
      })
    }),
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalGuard, JwtAuthGuard, FacebookStrategy],
  exports: [AuthService],
})
export class AuthModule {}
