import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRewardEntity } from '@entities/user-reward.entity';

import { UserRewardRepository } from './user-reward.repository';
import { UserRewardService } from './user-reward.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRewardEntity])],
  controllers: [],
  providers: [UserRewardService, UserRewardRepository],
  exports: [UserRewardService],
})
export class UserRewardModule {}
