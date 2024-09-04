import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RewardCustomEntity } from '@entities/reward-custom.entity';

import { RewardCustomRepository } from './reward-custom.repository';
import { RewardCustomService } from './reward-custom.service';

@Module({
  imports: [TypeOrmModule.forFeature([RewardCustomEntity])],
  controllers: [],
  providers: [RewardCustomService, RewardCustomRepository],
  exports: [RewardCustomService],
})
export class RewardCustomModule {}
