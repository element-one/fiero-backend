import { Injectable } from '@nestjs/common';

import { LoginOtpEntity } from '@entities/login-otp';

import { CreateLoginOtpDto } from './dto/create-login-otp.dto';
import { LoginOtpRepository } from './login-otp.repository';

@Injectable()
export class LoginOtpService {
  constructor(private readonly loginOtpRepository: LoginOtpRepository) {}

  async createLoginOtp(
    loginOtpDto: CreateLoginOtpDto,
  ): Promise<LoginOtpEntity> {
    return await this.loginOtpRepository.createLoginOtp({ ...loginOtpDto });
  }

  async findLastOtpByUid(uid: string): Promise<LoginOtpEntity> {
    const loginOtp = await this.loginOtpRepository.findOne({
      relations: ['user'],
      where: { user: { id: uid } },
      order: { createdAt: 'DESC' },
    });

    return loginOtp;
  }
}
