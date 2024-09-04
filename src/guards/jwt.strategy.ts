import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '@modules/auth/auth.service';
import { JwtPayload } from '@type/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'session' in req.cookies &&
      req.cookies.session.length > 0
    ) {
      return req.cookies.session;
    }
    return null;
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validatePayload(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
