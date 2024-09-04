import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RewardDiscountEntity } from '@entities/reward-discount.entity';

import { DiscountRepository } from './discount.repository';
import { DiscountService } from './discount.service';

@Module({
  imports: [TypeOrmModule.forFeature([RewardDiscountEntity])],
  controllers: [],
  providers: [DiscountService, DiscountRepository],
  exports: [DiscountService],
})
export class DiscountModule {}
