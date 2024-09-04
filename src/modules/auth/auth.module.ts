import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { GoogleStrategy } from '@guards/google.strategy';
import { InstagramStrategy } from '@guards/instagram.strategy';
import { JwtStrategy } from '@guards/jwt.strategy';
import { TikTokStrategy } from '@guards/tiktok.strategy';
import { TwitterStrategy } from '@guards/twitter.strategy';
import { LoginOtpModule } from '@modules/login-otp/login-otp.module';
import { UserModule } from '@modules/user/user.module';
import { UserLoginModule } from '@modules/user-login/user-login.module';
import { UserSocialModule } from '@modules/user-social/user-social.module';
import { SesService } from '@services/aws/ses.service';
import { IpStackService } from '@services/ipstack/ipstack.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    UserSocialModule,
    UserLoginModule,
    LoginOtpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TwitterStrategy,
    JwtStrategy,
    GoogleStrategy,
    InstagramStrategy,
    TikTokStrategy,
    SesService,
    IpStackService,
  ],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
