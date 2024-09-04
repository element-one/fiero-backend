import { Injectable } from '@nestjs/common';

import { UserLoginEntity } from '@entities/user-login.entity';

import { CreateUserLoginDto } from './dto/create-user-login.dto';
import { UserLoginRepository } from './use-login.repository';

@Injectable()
export class UserLoginService {
  constructor(private readonly userLoginRepository: UserLoginRepository) {}

  async createLogin(loginDto: CreateUserLoginDto): Promise<UserLoginEntity> {
    return await this.userLoginRepository.createLogin(loginDto);
  }

  async saveLogin(userLogin: UserLoginEntity): Promise<void> {
    await this.userLoginRepository.save(userLogin);
  }
}
