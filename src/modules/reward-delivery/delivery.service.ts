import { Injectable } from '@nestjs/common';

import { RewardDeliveryEntity } from '@entities/reward-delivery.entity';

import { AddDeliveryDto } from './dto/add-delivery.dto';
import { DeliveryRepository } from './delivery.repository';

@Injectable()
export class DeliveryService {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  async getById(id: string): Promise<RewardDeliveryEntity> {
    return await this.deliveryRepository.findById(id);
  }

  async createDelivery(dto: AddDeliveryDto): Promise<RewardDeliveryEntity> {
    const delivery = await this.deliveryRepository.createDelivery(dto);
    return await this.deliveryRepository.save(delivery);
  }

  async saveDelivery(
    delivery: RewardDeliveryEntity,
  ): Promise<RewardDeliveryEntity> {
    return await this.deliveryRepository.save(delivery);
  }
}
