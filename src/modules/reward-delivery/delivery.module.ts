import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RewardDeliveryEntity } from '@entities/reward-delivery.entity';

import { DeliveryRepository } from './delivery.repository';
import { DeliveryService } from './delivery.service';

@Module({
  imports: [TypeOrmModule.forFeature([RewardDeliveryEntity])],
  controllers: [],
  providers: [DeliveryService, DeliveryRepository],
  exports: [DeliveryService],
})
export class DeliveryModule {}
