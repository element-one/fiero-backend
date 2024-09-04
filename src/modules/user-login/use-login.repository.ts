import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserLoginEntity } from '@entities/user-login.entity';

import { CreateUserLoginDto } from './dto/create-user-login.dto';

@Injectable()
export class UserLoginRepository extends Repository<UserLoginEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserLoginEntity, dataSource.createEntityManager());
  }

  async createLogin(loginDto: CreateUserLoginDto): Promise<UserLoginEntity> {
    const result = this.create({ ...loginDto });
    return await this.save(result);
  }
}
