import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventRewardCustomEntity } from '@entities/event-reward-custome.entity';

import { EventRewardCustomRepository } from './event-reward-custom.repository';
import { EventRewardCustomService } from './event-reward-customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventRewardCustomEntity])],
  controllers: [],
  providers: [EventRewardCustomService, EventRewardCustomRepository],
  exports: [EventRewardCustomService],
})
export class EventRewardCustomModule {}
