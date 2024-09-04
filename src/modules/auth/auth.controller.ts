import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { User } from '@decorators/user.decorator';
import { ApiSuccessResponse } from '@dtos/api/api-success-response.dto';
import { UserEntity } from '@entities/user.entity';
import { GoogleGuard } from '@guards/google.guard';
import { InstagramGuard } from '@guards/instagram.guard';
import JwtGuard from '@guards/jwt.guard';
import { TikTokGuard } from '@guards/tiktok.guard';
import { TwitterGuard } from '@guards/twitter.guard';
import { GoogleUser } from '@type/common';
import { RealIP } from 'nestjs-real-ip';

import { LoginUserDto } from './dto/login-user.dto';
import { SocialVerifyDto } from './dto/social-verify.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  @UseGuards(JwtGuard)
  async getAuth() {
    return { message: 'authenticated' };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginUserDto): Promise<ApiSuccessResponse> {
    return await this.authService.loginUser(body);
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request) {
    const cookie = this.authService.getCookiesForLogout();
    req.res.setHeader('Set-Cookie', cookie);
    return { message: 'logged out' };
  }

  @Post('verify')
  @HttpCode(200)
  async verifyOtp(
    @Req() request: Request,
    @Body() body: VerifyOtpDto,
    @RealIP() ip: string,
  ): Promise<UserResponseDto> {
    const cookie = this.authService.getCookieWithJwtToken(body.email, request);
    request.res.setHeader('Set-Cookie', [cookie]);
    const user = await this.authService.verifyOtp(
      body,
      ip.replace('::ffff:', ''),
    );
    return { user };
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth() {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.signInGoogleUser(
      req.user as GoogleUser,
    );
    const cookie = this.authService.getCookieWithJwtToken(user.email, req);
    req.res.setHeader('Set-Cookie', [cookie]);
    res.redirect(`${process.env.WEB_URL}/redirect`);
  }

  @Get('twitter')
  @UseGuards(TwitterGuard)
  async twitterAuth() {
    return HttpStatus.OK;
  }

  @Get('twitter/callback')
  @UseGuards(TwitterGuard)
  async twitterAuthRedirect(@Req() req: Request, @Res() res: Response) {
    res.redirect(`${process.env.WEB_URL}/social`);
  }

  @Post('social/verify')
  @UseGuards(JwtGuard)
  async verifySocial(@User() user: UserEntity, @Body() body: SocialVerifyDto) {
    return await this.authService.verifySocial(user, body);
  }

  @Get('instagram')
  @UseGuards(InstagramGuard)
  async instagramAuth() {
    return HttpStatus.OK;
  }

  @Get('instagram/callback')
  @UseGuards(InstagramGuard)
  async instagramAuthRedirect(@Req() req: Request, @Res() res: Response) {
    res.redirect(`${process.env.WEB_URL}/social`);
  }

  @Get('tiktok')
  @UseGuards(TikTokGuard)
  async loginWithTikTok() {
    return HttpStatus.OK;
  }

  @Get('tiktok/callback')
  @UseGuards(TikTokGuard)
  async tiktokAuthRedirect(@Req() req: Request, @Res() res: Response) {
    res.redirect(`${process.env.WEB_URL}/social`);
  }
}
