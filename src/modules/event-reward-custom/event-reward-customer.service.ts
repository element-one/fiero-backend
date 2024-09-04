import { Injectable } from '@nestjs/common';

import { EventRewardCustomEntity } from '@entities/event-reward-custome.entity';

import { AddEventCustomDto } from './dto/add-event-custom.dto';
import { EventRewardCustomRepository } from './event-reward-custom.repository';

@Injectable()
export class EventRewardCustomService {
  constructor(
    private readonly eventRewardCustomRepository: EventRewardCustomRepository,
  ) {}

  async getById(id: string): Promise<EventRewardCustomEntity> {
    return await this.eventRewardCustomRepository.findById(id);
  }

  async getByEventRewardId(id: string): Promise<EventRewardCustomEntity> {
    return await this.eventRewardCustomRepository.findOne({
      relations: ['userEventReward'],
      where: { userEventReward: { id } },
    });
  }

  async createEventRewardCustom(
    dto: AddEventCustomDto,
  ): Promise<EventRewardCustomEntity> {
    const eventRewardCustom =
      await this.eventRewardCustomRepository.createEventCustom(dto);
    return await this.eventRewardCustomRepository.save(eventRewardCustom);
  }

  async saveEventRewardCustom(
    eventRewardCustom: EventRewardCustomEntity,
  ): Promise<EventRewardCustomEntity> {
    return await this.eventRewardCustomRepository.save(eventRewardCustom);
  }
}
