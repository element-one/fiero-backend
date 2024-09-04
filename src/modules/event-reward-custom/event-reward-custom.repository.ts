import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EventRewardCustomEntity } from '@entities/event-reward-custome.entity';

import { AddEventCustomDto } from './dto/add-event-custom.dto';

@Injectable()
export class EventRewardCustomRepository extends Repository<EventRewardCustomEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EventRewardCustomEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<EventRewardCustomEntity> {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  async createEventCustom(
    dto: AddEventCustomDto,
  ): Promise<EventRewardCustomEntity> {
    const result = this.create({ ...dto });
    return await this.save(result);
  }
}
