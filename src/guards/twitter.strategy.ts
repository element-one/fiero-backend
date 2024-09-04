import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-twitter';

import { AuthService } from '@modules/auth/auth.service';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      consumerKey: configService.get('TWITTER_CLIENT_ID'),
      consumerSecret: configService.get('TWITTER_CLIENT_SECRET'),
      callbackURL: configService.get('TWITTER_CALLBACK_URL'),
      userProfileURL:
        'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  // eslint-disable-next-line
  authenticate(req: Request, options: any) {
    if (req.query['userId']) {
      options.callbackURL =
        this.configService.get('TWITTER_CALLBACK_URL') +
        '?state=' +
        req.query['userId'];
    }

    super.authenticate(req, options);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const social = await this.authService.connectSocial({
      userId: req.query['state'] as string,
      user: {
        name: profile._json.name,
        username: profile._json.screen_name,
        userId: profile._json.id_str,
        profileImageUrl: profile._json.profile_image_url,
      },
      socialType: 'twitter',
    });

    return { ...social };
  }
}
