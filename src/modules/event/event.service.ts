import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as _ from 'lodash';

import { ApiSuccessResponse } from '@dtos/api/api-success-response.dto';
import { PageDto, PageMetaDto } from '@dtos/page';
import { EventEntity } from '@entities/event.entity';
import { UserEntity } from '@entities/user.entity';
import { UserEventRewardEntity } from '@entities/user-event-reward.entity';
import { EventNotFoundException } from '@exceptions/event-not-found';
import { EventRewardAlreadyCustomException } from '@exceptions/event-reward-already-custom';
import { EventRewardNotAvailableException } from '@exceptions/event-reward-not-available';
import { SomethingWentWrongException } from '@exceptions/something-went-wrong';
import { EventRewardService } from '@modules/event-reward/event-reward.service';
import { AddEventCustomDto } from '@modules/event-reward-custom/dto/add-event-custom.dto';
import { EventRewardCustomService } from '@modules/event-reward-custom/event-reward-customer.service';
import { EventRaffleParamsDto } from '@modules/event-reward-raffle/dto/event-raffle-params.dto';
import { EventRewardRaffleService } from '@modules/event-reward-raffle/event-reward-raffle.service';
import { EventUserDto } from '@modules/event-user/dto/event-user.dto';
import { EventUserService } from '@modules/event-user/event-user.service';
import { UserEventRewardService } from '@modules/user-event-reward/user-event-reward.service';
import { EventTypeEnum } from '@type/enum';

import { EventDto } from './dto/event.dto';
import { EventParamsDto } from './dto/event-params.dto';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    @Inject(forwardRef(() => EventRewardService))
    private readonly eventRewardService: EventRewardService,
    private readonly userEventRewardService: UserEventRewardService,
    private readonly eventRewardRaffleService: EventRewardRaffleService,
    private readonly eventRewardCustomService: EventRewardCustomService,
    private readonly eventUserService: EventUserService,
  ) {}

  async getEvents(pageOptionsDto: EventParamsDto): Promise<PageDto<EventDto>> {
    let queryBuilder = this.eventRepository.createQueryBuilder('event');

    if (pageOptionsDto.location) {
      queryBuilder = queryBuilder.where('"location" = :location', {
        location: pageOptionsDto.location,
      });
    }

    if (pageOptionsDto.type) {
      if (pageOptionsDto.type === EventTypeEnum.POPULAR) {
        queryBuilder = queryBuilder.andWhere('"isPopular" = true');
      } else if (pageOptionsDto.type === EventTypeEnum.TODAY) {
        const startTime = moment().format('YYYY-MM-DD 00:00:00');
        const endTime = moment().format('YYYY-MM-DD 23:59:59');
        console.debug(`today: ${startTime}, ${endTime}`);
        queryBuilder = queryBuilder.andWhere(
          'event_at >= :startTime and event_at <= :endTime',
          { startTime, endTime },
        );
      } else if (pageOptionsDto.type === EventTypeEnum.WEEKEND) {
        const startTime = moment().endOf('week').format('YYYY-MM-DD 00:00:00');
        const endTime = moment().endOf('week').format('YYYY-MM-DD 23:59:59');
        console.debug(`weekend: ${startTime}, ${endTime}`);
        queryBuilder = queryBuilder.where(
          'event_at >= :startTime and event_at <= :endTime',
          { startTime, endTime },
        );
      }
    }

    queryBuilder
      .orderBy('"order"', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getEvent(eventId: string): Promise<EventEntity> {
    const event = await this.eventRepository.findById(eventId);
    return event;
  }

  async getEventBySlug(slug: string): Promise<EventDto> {
    const event = await this.eventRepository.findBySlug(slug);
    const orderedRewards = _.orderBy(event.eventRewards, 'order', 'asc');
    event.eventRewards = orderedRewards.filter(
      (reward) => reward.isHidden === false,
    );
    return event;
  }

  async claimEventReward(user: UserEntity, eventRewardId: string) {
    return await this.eventRewardService.claimEventReward(user, eventRewardId);
  }

  async redeemEventReward(qrCode: string) {
    return await this.userEventRewardService.redeemUserEventReward(qrCode);
  }

  async getUserEventRewards(userId: string) {
    return await this.userEventRewardService.getByUserId(userId);
  }

  async getRaffleWinner(user: UserEntity, params: EventRaffleParamsDto) {
    if (
      ['zoe@glass.fun', 'rick@glass.fun', 'ellie@glass.fun'].includes(
        user.email,
      )
    ) {
      const eventRaffle = await this.eventRewardRaffleService.endRaffle(params);
      const event = await this.eventRepository.findById(params.eventId);
      const winners = event.winners as any[]; // eslint-disable-line
      _.remove(winners, (winner) => winner.round === event.round);
      winners.push({ round: event.round, raffleId: eventRaffle.id });
      event.winners = winners;
      await this.eventRepository.save(event);
      return eventRaffle;
    } else {
      throw new SomethingWentWrongException();
    }
  }

  async createRaffleRound(user: UserEntity, params: EventRaffleParamsDto) {
    if (
      ['zoe@glass.fun', 'rick@glass.fun', 'ellie@glass.fun'].includes(
        user.email,
      )
    ) {
      const event = await this.eventRepository.findById(params.eventId);
      event.round += 1;
      return await this.eventRepository.save(event);
    } else {
      throw new SomethingWentWrongException();
    }
  }

  async addEventCustom(
    userId: string,
    eventRewardId: string,
    dto: AddEventCustomDto,
  ): Promise<UserEventRewardEntity> {
    const eventReward = await this.eventRewardService.getById(eventRewardId);
    if (!eventReward) {
      throw new EventNotFoundException();
    }

    let userEventReward =
      await this.userEventRewardService.getByUserIdAndEventRewardId(
        userId,
        eventRewardId,
      );

    if (!userEventReward) {
      throw new EventRewardNotAvailableException();
    }

    const existEventRewardCustom =
      await this.eventRewardCustomService.getByEventRewardId(
        userEventReward.id,
      );
    if (existEventRewardCustom) {
      throw new EventRewardAlreadyCustomException();
    }

    const eventRewardCustomer =
      await this.eventRewardCustomService.createEventRewardCustom(dto);
    eventRewardCustomer.userEventReward = userEventReward;
    await this.eventRewardCustomService.saveEventRewardCustom(
      eventRewardCustomer,
    );

    userEventReward = await this.userEventRewardService.getById(
      userEventReward.id,
    );
    return userEventReward;
  }

  async userEventReward(dto: EventUserDto): Promise<ApiSuccessResponse> {
    return await this.eventUserService.saveEventUser(dto);
  }
}
