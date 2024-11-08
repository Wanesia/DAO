import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() userDto: { email: string; password: string; name: string },
  ) {
    return this.authService.register(userDto);
  }
  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
}
  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request){

    return req.user;
  }
}
