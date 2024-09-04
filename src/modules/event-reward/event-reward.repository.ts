import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EventRewardEntity } from '@entities/event-reward.entity';

@Injectable()
export class EventRewardRepository extends Repository<EventRewardEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EventRewardEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<EventRewardEntity> {
    const eventReward = await this.findOne({
      where: { id },
      relations: ['event'],
    });
    return eventReward;
  }
}
