import { Injectable } from '@nestjs/common';

import { RewardSpinEntity } from '@entities/reward-spin.entity';

import { RewardSpinRepository } from './reward-spin.repository';

@Injectable()
export class RewardSpinService {
  constructor(private readonly rewardSpinRepository: RewardSpinRepository) {}

  async findByUserIdAndRewardId(
    userId: string,
    rewardId: string,
  ): Promise<RewardSpinEntity> {
    const result = await this.rewardSpinRepository.findOne({
      where: { user: { id: userId }, reward: { id: rewardId } },
    });
    return result;
  }
}
