import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

import { AuthService } from '@modules/auth/auth.service';
import type { Profile } from 'passport-tiktok-auth';
import { Strategy } from 'passport-tiktok-auth';

@Injectable()
export class TikTokStrategy extends PassportStrategy(Strategy, 'tiktok') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('TIKTOK_CLIENT_ID'),
      clientSecret: configService.get<string>('TIKTOK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('TIKTOK_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['user.info.basic', 'user.info.stats', 'video.list'],
    });
  }

  // eslint-disable-next-line
  authenticate(req: Request, options: any) {
    const csrfState = Math.random().toString(36).substring(2);
    options.state = csrfState;
    if (req.query['userId']) {
      options.state = req.query['userId'];
    }

    super.authenticate(req, options);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<void> {
    const longToken = await this.authService.getTiktokRefreshToken(
      refreshToken,
    );

    const user = await this.authService.connectSocial({
      userId: req.query['state'] as string,
      user: {
        name: profile?._json?.data?.user?.display_name || profile.username,
        username: profile.username,
        userId: profile.id,
        profileImageUrl: profile.avatar,
        token: longToken || accessToken,
      },
      socialType: 'tiktok',
    });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  }
}
