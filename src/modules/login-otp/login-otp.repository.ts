import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { LoginOtpEntity } from '@entities/login-otp';

import { CreateLoginOtpDto } from './dto/create-login-otp.dto';

@Injectable()
export class LoginOtpRepository extends Repository<LoginOtpEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(LoginOtpEntity, dataSource.createEntityManager());
  }

  async createLoginOtp(
    loginOtpDto: CreateLoginOtpDto,
  ): Promise<LoginOtpEntity> {
    const result = this.create({ ...loginOtpDto });
    return await this.save(result);
  }
}
