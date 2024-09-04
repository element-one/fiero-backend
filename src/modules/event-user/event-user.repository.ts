import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EventUserEntity } from '@entities/event-user.entity';

@Injectable()
export class EventUserRepository extends Repository<EventUserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EventUserEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<EventUserEntity> {
    const eventUser = await this.findOne({
      where: { id },
    });
    return eventUser;
  }

  async findByEmail(email: string): Promise<EventUserEntity> {
    const eventUser = await this.findOne({
      where: { email },
    });
    return eventUser;
  }
}
