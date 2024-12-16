import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { UsersService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: 'http://localhost:3000/auth/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    try {
      const { name, emails, id } = profile;

      let user = await this.userService.findUserByEmail(emails[0].value);

      if (!user) {
        const userData = {
          email: emails[0].value,
          name: name.givenName,
          surname: name.familyName,
          authProvider: 'facebook',
          facebookId: id,
        };

        user = await this.authService.createFacebookUser(userData);
      }

      const payload = {
        user,
        accessToken,
      };

      done(null, payload);
    } catch (error) {
      done(error, null);
    }
  }
}
