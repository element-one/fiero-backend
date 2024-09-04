import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserLoginEntity } from '@entities/user-login.entity';

import { UserLoginRepository } from './use-login.repository';
import { UserLoginService } from './user-login.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserLoginEntity])],
  controllers: [],
  providers: [UserLoginService, UserLoginRepository],
  exports: [UserLoginService],
})
export class UserLoginModule {}
