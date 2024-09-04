import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { config } from 'dotenv';
import * as _ from 'lodash';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { GoogleUser } from '@type/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  // eslint-disable-next-line
  authenticate(req: Request, options: any) {
    if (req.query['referralCode']) {
      options.state = req.query['referralCode'];
    }

    super.authenticate(req, options);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    if (!profile) {
      throw new UnauthorizedException();
    }

    const ip = _.get(req.headers, 'true-client-ip') as string;

    const { name, emails, photos } = profile;
    const user: GoogleUser = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      referral: req.query['state'] as string,
      accessToken,
      ip,
    };

    done(null, user);
  }
}
