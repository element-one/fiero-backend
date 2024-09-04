import { Injectable } from '@nestjs/common';

import { PageDto, PageMetaDto } from '@dtos/page';
import { EventEntity } from '@entities/event.entity';
import { EventRewardRaffleEntity } from '@entities/event-reward-raffle.entity';
import { UserEntity } from '@entities/user.entity';
import { RaffleAlreadyClaimedException } from '@exceptions/raffle-already-claimed';
import { SomethingWentWrongException } from '@exceptions/something-went-wrong';
import { getRandomInt } from '@utils/common';

import { EventRaffleParamsDto } from './dto/event-raffle-params.dto';
import { EventRewardRaffleRepository } from './event-reward-raffle.repository';

@Injectable()
export class EventRewardRaffleService {
  constructor(
    private readonly eventRewardRaffleRepository: EventRewardRaffleRepository,
  ) {}

  async getById(id: string): Promise<EventRewardRaffleEntity> {
    return await this.eventRewardRaffleRepository.findById(id);
  }

  async getEventRaffles(
    pageOptionsDto: EventRaffleParamsDto,
  ): Promise<PageDto<EventRewardRaffleEntity>> {
    const queryBuilder =
      this.eventRewardRaffleRepository.createQueryBuilder('event_raffle');

    queryBuilder
      .leftJoinAndSelect('event_raffle.event', 'event')
      .leftJoinAndSelect('event_raffle.user', 'user')
      .orderBy('event_raffle.token', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (pageOptionsDto.eventId) {
      queryBuilder.andWhere('event_reward.event.id = :eventId', {
        eventId: pageOptionsDto.eventId,
      });
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getEventRaffle(eventId: string): Promise<EventRewardRaffleEntity> {
    const eventRaffle = await this.eventRewardRaffleRepository.findById(
      eventId,
    );
    return eventRaffle;
  }

  async createUserEventRaffle(user: UserEntity, event: EventEntity) {
    const eventRaffle = await this.eventRewardRaffleRepository
      .createQueryBuilder()
      .select('event_raffle')
      .from(EventRewardRaffleEntity, 'event_raffle')
      .where(
        'event_raffle.userId = :userId and event_raffle.eventId = :eventId',
        {
          userId: user.id,
          eventId: event.id,
        },
      )
      .getOne();
    if (eventRaffle) {
      console.debug(`existed, userId: ${user.id} eventId: ${event.id}`);
      throw new RaffleAlreadyClaimedException();
    }

    const count = await this.eventRewardRaffleRepository
      .createQueryBuilder('event_raffle')
      .leftJoinAndSelect('event_raffle.event', 'event')
      .where('event.id = :eventId', { eventId: event.id })
      .getCount();

    const newEventRaffle = this.eventRewardRaffleRepository.create({
      user,
      event,
      round: event.round,
      token: count + 1,
      isRedeemed: false,
    });
    return await this.eventRewardRaffleRepository.save(newEventRaffle);
  }

  async endRaffle(params: EventRaffleParamsDto) {
    const raffles = await this.eventRewardRaffleRepository.findByEventId(
      params.eventId,
    );

    if (raffles.length === 0) {
      // no winner
      throw new SomethingWentWrongException();
    }

    const winner = raffles[0].event.winners.find(
      (winner) => winner.round === raffles[0].event.round,
    );

    // not redraw
    if (winner && !params.isRedraw) {
      return raffles.find((raffle) => raffle.id === winner.raffleId);
    }

    // continue draw another winner
    if (raffles.length === 0) {
      // no winner
      throw new SomethingWentWrongException();
    }

    const winnerToken = getRandomInt(1, raffles.length);
    const eventRaffle =
      await this.eventRewardRaffleRepository.findByEventIdAndToken(
        params.eventId,
        winnerToken,
      );

    return await this.eventRewardRaffleRepository.save(eventRaffle);
  }
}
