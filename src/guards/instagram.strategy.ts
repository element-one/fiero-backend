import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-instagram-graph';

import { AuthService } from '@modules/auth/auth.service';

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('INSTAGRAM_CLIENT_ID'),
      clientSecret: configService.get('INSTAGRAM_CLIENT_SECRET'),
      callbackURL: configService.get('INSTAGRAM_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['instagram_graph_user_profile', 'user_profile', 'user_media'],
    });
  }

  // eslint-disable-next-line
  authenticate(req: Request, options: any) {
    if (req.query['userId']) {
      options.state = req.query['userId'];
    }

    super.authenticate(req, options);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const longToken = await this.authService.getInstagramRefreshToken(
      accessToken,
    );
    const user = await this.authService.connectSocial({
      userId: req.query['state'] as string,
      user: {
        name: '',
        username: profile._json.username,
        userId: profile._json.id,
        profileImageUrl: '',
        token: longToken,
      },
      socialType: 'instagram',
    });

    return { ...user };
  }
}
