import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import { PageDto, PageMetaDto } from '@dtos/page';
import { EventRewardEntity } from '@entities/event-reward.entity';
import { UserEntity } from '@entities/user.entity';
import { UserEventRewardEntity } from '@entities/user-event-reward.entity';
import { RewardAlreadyClaimedException } from '@exceptions/reward-already-claimed';
import { RewardNotEnoughTokenException } from '@exceptions/reward-not-enough-token';
import { RewardNotFoundException } from '@exceptions/reward-not-found';
import { RewardNotRedeemedException } from '@exceptions/reward-not-redeemed';
import { UserResidenceRestrictedException } from '@exceptions/user-residence-restricted';
import { EventService } from '@modules/event/event.service';
import { EventRewardRaffleService } from '@modules/event-reward-raffle/event-reward-raffle.service';
import { UserEventRewardService } from '@modules/user-event-reward/user-event-reward.service';
import { UserHoldingService } from '@modules/user-holding/user-holding.service';
import { EventRewardEnum, EventRewardUsageEnum } from '@type/enum';
import { randomString } from '@utils/common';

import { EventRewardDto } from './dto/event-reward.dto';
import { EventRewardParamsDto } from './dto/event-reward-params.dto';
import { EventRewardRepository } from './event-reward.repository';

@Injectable()
export class EventRewardService {
  constructor(
    private readonly eventRewardRepository: EventRewardRepository,
    private readonly userEventRewardService: UserEventRewardService,
    private readonly userHoldingService: UserHoldingService,
    private readonly eventRewardRaffleService: EventRewardRaffleService,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
  ) {}

  async getById(rewardId: string): Promise<EventRewardEntity> {
    return await this.eventRewardRepository.findById(rewardId);
  }

  async getEventRewards(
    pageOptionsDto: EventRewardParamsDto,
  ): Promise<PageDto<EventRewardDto>> {
    const queryBuilder =
      this.eventRewardRepository.createQueryBuilder('event_reward');

    queryBuilder
      .leftJoinAndSelect('event_reward.event', 'event')
      .orderBy('event_reward.createdAt', pageOptionsDto.order)
      .where('event_reward.isHidden = :isHidden', { isHidden: false })
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (pageOptionsDto.isPopular) {
      queryBuilder.andWhere('event_reward.isPopular = :isPopular', {
        isPopular: true,
      });
    }

    if (pageOptionsDto.slug) {
      queryBuilder.andWhere('event_reward.event.slug = :slug', {
        slug: pageOptionsDto.slug,
      });
    }
    // console.debug(queryBuilder.getSql());

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getEventReward(
    userId: string,
    eventRewardId: string,
  ): Promise<EventRewardEntity> {
    const eventReward = await this.eventRewardRepository.findById(
      eventRewardId,
    );
    const userReward =
      await this.userEventRewardService.getByUserIdAndEventRewardId(
        userId,
        eventRewardId,
      );
    eventReward['userReward'] = userReward;
    return eventReward;
  }

  async claimEventReward(
    user: UserEntity,
    eventRewardId: string,
  ): Promise<UserEventRewardEntity> {
    const eventReward = await this.eventRewardRepository.findById(
      eventRewardId,
    );
    if (!eventReward) {
      throw new RewardNotFoundException();
    }

    let userEventReward =
      await this.userEventRewardService.getUnredeemedByUserIdAndEventRewardId(
        user.id,
        eventRewardId,
      );

    if (userEventReward) {
      if (eventReward.usage === EventRewardUsageEnum.SINGLE) {
        // allow multiple usage
        throw new RewardAlreadyClaimedException();
      } else {
        // multiple, need previous one to be redeemed
        throw new RewardNotRedeemedException();
      }
    }

    if (eventReward.states?.length !== 0 && !user.state) {
      throw new UserResidenceRestrictedException();
    }

    if (
      eventReward.states?.length !== 0 &&
      !_.includes(eventReward.states, user.state)
    ) {
      throw new UserResidenceRestrictedException();
    }

    if (eventReward.points > 0) {
      const userHolding = await this.userHoldingService.getByUserIdAndBrandId(
        user.id,
        eventReward.event.brandId,
      );

      if (!userHolding || userHolding.points < eventReward.points) {
        throw new RewardNotEnoughTokenException();
      }

      userHolding.points -= eventReward.points;
      await this.userHoldingService.saveUserHolding(userHolding);
    }

    const qrCode =
      eventReward.type === EventRewardEnum.MERCHANDISE
        ? randomString(16)
        : null;
    userEventReward = await this.userEventRewardService.createUserEventReward({
      user,
      eventReward,
      isClaimed: true,
      qrCode,
    });

    userEventReward =
      await this.userEventRewardService.getByUserIdAndEventRewardId(
        user.id,
        eventRewardId,
      );

    if (eventReward.type === EventRewardEnum.RAFFLE) {
      await this.eventRewardRaffleService.createUserEventRaffle(
        user,
        eventReward.event,
      );
    }

    return userEventReward;
  }
}
