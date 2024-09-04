import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEarnEntity } from '@entities/user-earn.entity';

import { UserEarnRepository } from './user-earn.repository';
import { UserEarnService } from './user-earn.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEarnEntity])],
  controllers: [],
  providers: [UserEarnService, UserEarnRepository],
  exports: [UserEarnService],
})
export class UserEarnModule {}
