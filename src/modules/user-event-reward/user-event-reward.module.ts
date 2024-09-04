import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEventRewardEntity } from '@entities/user-event-reward.entity';

import { UserEventRewardRepository } from './user-event-reward.repository';
import { UserEventRewardService } from './user-event-reward.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEventRewardEntity])],
  controllers: [],
  providers: [UserEventRewardService, UserEventRewardRepository],
  exports: [UserEventRewardService],
})
export class UserEventRewardModule {}
