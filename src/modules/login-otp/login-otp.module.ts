import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoginOtpEntity } from '@entities/login-otp';

import { LoginOtpRepository } from './login-otp.repository';
import { LoginOtpService } from './login-otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoginOtpEntity])],
  controllers: [],
  providers: [LoginOtpService, LoginOtpRepository],
  exports: [LoginOtpService],
})
export class LoginOtpModule {}
