import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RewardRaffleEntity } from '@entities/reward-raffle.entity';

@Injectable()
export class RewardRaffleRepository extends Repository<RewardRaffleEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RewardRaffleEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<RewardRaffleEntity> {
    const raffle = await this.findOne({
      where: { id },
      relations: ['reward', 'user'],
    });
    return raffle;
  }

  async findByRewardId(id: string): Promise<RewardRaffleEntity[]> {
    const rewardRaffle = await this.find({
      where: { reward: { id } },
      relations: ['reward', 'user'],
    });
    return rewardRaffle;
  }

  async findByEventIdAndToken(
    rewardId: string,
    token: number,
  ): Promise<RewardRaffleEntity> {
    const rewardRaffle = await this.findOne({
      where: { reward: { id: rewardId }, token },
      relations: ['reward', 'user'],
    });
    return rewardRaffle;
  }
}
