import { Injectable } from '@nestjs/common';

import { PageDto, PageMetaDto } from '@dtos/page';
import { RewardEntity } from '@entities/reward.entity';
import { RewardRaffleEntity } from '@entities/reward-raffle.entity';
import { UserEntity } from '@entities/user.entity';
import { RaffleAlreadyClaimedException } from '@exceptions/raffle-already-claimed';
import { SomethingWentWrongException } from '@exceptions/something-went-wrong';
import { getRandomInt } from '@utils/common';

import { RaffleParamsDto } from './dto/raffle-params.dto';
import { RewardRaffleRepository } from './reward-raffle.repository';

@Injectable()
export class RewardRaffleService {
  constructor(
    private readonly rewardRaffleRepository: RewardRaffleRepository,
  ) {}

  async getById(id: string): Promise<RewardRaffleEntity> {
    return await this.rewardRaffleRepository.findById(id);
  }

  async getEventRaffles(
    pageOptionsDto: RaffleParamsDto,
  ): Promise<PageDto<RewardRaffleEntity>> {
    const queryBuilder =
      this.rewardRaffleRepository.createQueryBuilder('event_raffle');

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

  async getEventRaffle(eventId: string): Promise<RewardRaffleEntity> {
    const eventRaffle = await this.rewardRaffleRepository.findById(eventId);
    return eventRaffle;
  }

  async createUserRaffle(user: UserEntity, reward: RewardEntity) {
    const eventRaffle = await this.rewardRaffleRepository
      .createQueryBuilder()
      .select('reward_raffle')
      .from(RewardRaffleEntity, 'reward_raffle')
      .where(
        'reward_raffle.userId = :userId and reward_raffle.rewardId = :rewardId',
        {
          userId: user.id,
          rewardId: reward.id,
        },
      )
      .getOne();
    if (eventRaffle) {
      console.debug(`existed, userId: ${user.id} rewardId: ${reward.id}`);
      throw new RaffleAlreadyClaimedException();
    }

    const count = await this.rewardRaffleRepository
      .createQueryBuilder('reward_raffle')
      .leftJoinAndSelect('reward_raffle.reward', 'reward')
      .where('reward.id = :rewardId', { rewardId: reward.id })
      .getCount();

    const newRewardRaffle = this.rewardRaffleRepository.create({
      user,
      reward,
      round: reward.round,
      token: count + 1,
      isRedeemed: false,
    });
    return await this.rewardRaffleRepository.save(newRewardRaffle);
  }

  async endRaffle(params: RaffleParamsDto) {
    const raffles = await this.rewardRaffleRepository.findByRewardId(
      params.eventId,
    );

    if (raffles.length === 0) {
      // no winner
      throw new SomethingWentWrongException();
    }

    const winner = raffles[0].reward.winners.find(
      (winner) => winner.round === raffles[0].reward.round,
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
    const eventRaffle = await this.rewardRaffleRepository.findByEventIdAndToken(
      params.eventId,
      winnerToken,
    );

    return await this.rewardRaffleRepository.save(eventRaffle);
  }
}
