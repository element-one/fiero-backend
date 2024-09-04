import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RewardDiscountEntity } from '@entities/reward-discount.entity';

@Injectable()
export class DiscountRepository extends Repository<RewardDiscountEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RewardDiscountEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<RewardDiscountEntity> {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  // async findByUserIdRewardId(
  //   userId: string,
  //   rewardId: string,
  // ): Promise<RewardDiscountEntity> {
  //   const result = await this.findOne({
  //     relations: ['userReward', 'reward', 'userReward.user'],
  //     where: { reward: { id: rewardId }, userReward: { user: { id: userId } } },
  //   });
  //   return result;
  // }

  async findUnusedRewardId(rewardId: string): Promise<RewardDiscountEntity> {
    const result = await this.findOne({
      relations: ['userReward', 'reward'],
      where: { reward: { id: rewardId }, userReward: null },
    });
    return result;
  }
}
