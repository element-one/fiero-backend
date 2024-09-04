import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as generator from 'generate-password';
import * as moment from 'moment';

import { ApiSuccessResponse } from '@dtos/api/api-success-response.dto';
import { UserEntity } from '@entities/user.entity';
import { UserSocialEntity } from '@entities/user-social.entity';
import { CantSendCodeException } from '@exceptions/cant-send-code';
import { InvalidCodeException } from '@exceptions/invalid-code';
import { InvalidEmailException } from '@exceptions/invalid-email';
import { UserNotFoundException } from '@exceptions/user-not-found';
import { LoginOtpService } from '@modules/login-otp/login-otp.service';
import { UserService } from '@modules/user/user.service';
import { UserLoginService } from '@modules/user-login/user-login.service';
import { SocialAccountDto } from '@modules/user-social/dto/social-account.dto';
import { UserSocialService } from '@modules/user-social/user-social.service';
import { SesService } from '@services/aws/ses.service';
import { IpStackService } from '@services/ipstack/ipstack.service';
import { GoogleUser, JwtPayload } from '@type/common';
import { isValidEmail } from '@utils/common';

import { CantVerifyException } from './../../exceptions/cant-verify';
import { LoginUserDto } from './dto/login-user.dto';
import { SocialVerifyDto } from './dto/social-verify.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly userSocialService: UserSocialService,
    private readonly userLoginService: UserLoginService,
    private readonly jwtService: JwtService,
    private readonly sesService: SesService,
    private readonly ipStackService: IpStackService,
    private readonly loginOtpService: LoginOtpService,
  ) {}

  async validatePayload(payload: JwtPayload): Promise<UserEntity | null> {
    const user = await this.userService.getByEmail(payload.email);
    if (!user) return null;
    return user;
  }

  async loginUser(dto: LoginUserDto): Promise<ApiSuccessResponse> {
    if (this.configService.get('APP_ENV') !== 'dev') {
      if (!isValidEmail(dto.email)) {
        throw new InvalidEmailException();
      }
    }

    let user = await this.userService.getByEmail(dto.email);
    if (user) {
      await this.sendCodeWithEmail(user, user.email, false);
    } else {
      // create the user
      user = await this.userService.createUser(dto);
      await this.sendCodeWithEmail(user, user.email, true);
    }

    return new ApiSuccessResponse();
  }

  async sendCodeWithEmail(
    user: UserEntity,
    email: string,
    isNewUser: boolean,
  ): Promise<void> {
    const otpCode = generator.generate({
      length: 4,
      lowercase: false,
      uppercase: false,
      numbers: true,
    });

    if (isNewUser) {
      await this.sesService.sendFirstTimeOtpCodeEmail(otpCode, email);
    } else {
      await this.sesService.sendOtpCodeEmail(otpCode, email);
    }

    try {
      await this.loginOtpService.createLoginOtp({
        otpCode,
        otpCodeSendAt: new Date(),
        otpCodeExpiredAt: moment().add(300, 'minutes').toDate(),
        user,
      });
    } catch (err) {
      console.log(err);
      throw new CantSendCodeException();
    }
  }

  async verifyOtp(dto: VerifyOtpDto, ip: string): Promise<UserEntity> {
    let user = await this.userService.getByEmail(dto.email);
    if (!user) {
      throw new UserNotFoundException();
    }

    // TODO: remove after pass review
    if (user.email === 'test@glass.fun') {
      return await this.userService.activateUser(user);
    }

    const loginOtp = await this.loginOtpService.findLastOtpByUid(user.id);

    if (
      !loginOtp ||
      !loginOtp.otpCode ||
      !loginOtp.otpCodeExpiredAt ||
      loginOtp.otpCodeExpiredAt.getTime() < Date.now()
    ) {
      throw new InvalidCodeException();
    }

    if (loginOtp.otpCode !== dto.otpCode) {
      throw new InvalidCodeException();
    }

    if (!user.country || !user.state) {
      const residence = await this.ipStackService.getResidence(ip);
      console.log(residence);
      await this.userService.updateResidence(user, {
        country: residence.country,
        state: residence.state,
      });
    }

    await this.userLoginService.createLogin({ source: 'email', user, ip });
    if (!user.isEmailVerified) {
      user = await this.userService.activateUser(user);
    }
    if (user.isFirst) {
      await this.userService.updateFirstLogin(user);
      user.isFirst = true;
    }
    return user;
  }

  getCookieWithJwtToken(email: string, request: Request): string {
    const payload: JwtPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
    });

    if (this.configService.get('APP_ENV') === 'local') {
      console.log(request.headers.origin);
      return `session=${token}; Path=/; Max-Age=${this.configService.get(
        'JWT_EXPIRATION_TIME',
      )};`;
    }

    if (this.configService.get('APP_ENV') === 'dev') {
      return `session=${token}; Path=/; Max-Age=${this.configService.get(
        'JWT_EXPIRATION_TIME',
      )}; ${'SameSite=None; Secure; HttpOnly;'} domain=${this.configService.get(
        'COOKIE_DOMAIN',
      )}`;
    }

    return `session=${token}; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}; SameSite=None; Secure; HttpOnly; domain=${this.configService.get(
      'COOKIE_DOMAIN',
    )}`;
  }

  getCookiesForLogout() {
    return `session=; SameSite=None; Secure; HttpOnly; Path=/; Max-Age=0; domain=${this.configService.get(
      'COOKIE_DOMAIN',
    )}`;
  }

  async signInGoogleUser(googleUser: GoogleUser): Promise<UserEntity> {
    let user = await this.userService.getByEmail(googleUser.email);

    if (!user) {
      // register user
      user = await this.userService.createSocialUser({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        profileImageUrl: googleUser.picture,
        name: null,
        referralCode: googleUser.referral,
      });

      await this.sesService.sendFirstTimeGoogleAuthCodeEmail(googleUser.email);
    }

    if (!user.country || !user.state) {
      if (googleUser.ip) {
        const residence = await this.ipStackService.getResidence(googleUser.ip);
        console.log(residence);
        await this.userService.updateResidence(user, {
          country: residence.country,
          state: residence.state,
        });
      }
    }
    await this.userLoginService.createLogin({ source: 'google', user });

    return user;
  }

  async getInstagramRefreshToken(accessToken: string): Promise<string> {
    const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${this.configService.get(
      'INSTAGRAM_CLIENT_SECRET',
    )}&access_token=${accessToken}`;

    try {
      const result = await this.httpService.axiosRef.get(url);
      return result.data.access_token;
    } catch (err) {
      console.log(err);
    }
  }

  async getTiktokRefreshToken(refreshToken: string): Promise<string> {
    const url = `https://open-api.tiktok.com/oauth/refresh_token/?grant_type=refresh_token&client_key=${this.configService.get(
      'TIKTOK_CLIENT_ID',
    )}&refresh_token=${refreshToken}`;

    try {
      const result = await this.httpService.axiosRef.get(url);
      return result.data?.data?.access_token;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async connectSocial(account: SocialAccountDto): Promise<UserSocialEntity> {
    const user = await this.userService.getById(account.userId);

    const code = '';
    // find or create account in social
    const socialDto = {
      ...account.user,
      socialId: account.user.userId,
      type: account.socialType,
      code,
      user,
      isVerified: !!user,
    };
    const social = await this.userSocialService.findOrCreateSocial(socialDto);
    return social;
  }

  async verifySocial(
    user: UserEntity,
    dto: SocialVerifyDto,
  ): Promise<UserEntity> {
    const social = await this.userSocialService.getBySocialId(dto.socialId);
    if (social?.code === dto.code) {
      social.user = user;
      social.isVerified = true;
      await this.userSocialService.saveSocial(social);
    } else {
      throw new CantVerifyException();
    }

    return await this.userService.getById(user.id);
  }
}
