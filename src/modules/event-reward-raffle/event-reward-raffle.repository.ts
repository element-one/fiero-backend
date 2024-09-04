import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EventRewardRaffleEntity } from '@entities/event-reward-raffle.entity';

@Injectable()
export class EventRewardRaffleRepository extends Repository<EventRewardRaffleEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EventRewardRaffleEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<EventRewardRaffleEntity> {
    const eventRaffle = await this.findOne({
      where: { id },
      relations: ['event', 'user'],
    });
    return eventRaffle;
  }

  async findByEventId(id: string): Promise<EventRewardRaffleEntity[]> {
    const eventRaffle = await this.find({
      where: { event: { id } },
      relations: ['event', 'user'],
    });
    return eventRaffle;
  }

  async findByEventIdAndToken(
    eventId: string,
    token: number,
  ): Promise<EventRewardRaffleEntity> {
    const eventRaffle = await this.findOne({
      where: { event: { id: eventId }, token },
      relations: ['event', 'user'],
    });
    return eventRaffle;
  }
}
