import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RewardDeliveryEntity } from '@entities/reward-delivery.entity';

import { AddDeliveryDto } from './dto/add-delivery.dto';

@Injectable()
export class DeliveryRepository extends Repository<RewardDeliveryEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RewardDeliveryEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<RewardDeliveryEntity> {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  async createDelivery(dto: AddDeliveryDto): Promise<RewardDeliveryEntity> {
    const result = this.create({ ...dto });
    return await this.save(result);
  }
}
