import { Injectable } from '@nestjs/common';

import { RewardDiscountEntity } from '@entities/reward-discount.entity';

import { DiscountRepository } from './discount.repository';

@Injectable()
export class DiscountService {
  constructor(private readonly discountRepository: DiscountRepository) {}

  async getById(id: string): Promise<RewardDiscountEntity> {
    return await this.discountRepository.findById(id);
  }

  async getUnusedByRewardId(rewardId: string): Promise<RewardDiscountEntity> {
    return await this.discountRepository.findUnusedRewardId(rewardId);
  }

  async saveDiscount(
    discount: RewardDiscountEntity,
  ): Promise<RewardDiscountEntity> {
    return await this.discountRepository.save(discount);
  }
}
