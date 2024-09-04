import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EventEntity } from '@entities/event.entity';

@Injectable()
export class EventRepository extends Repository<EventEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EventEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<EventEntity> {
    const event = await this.findOne({
      where: { id },
    });
    return event;
  }

  async findBySlug(slug: string): Promise<EventEntity> {
    const event = await this.findOne({
      where: { slug },
    });
    return event;
  }
}
