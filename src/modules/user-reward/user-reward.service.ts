import { Injectable } from '@nestjs/common';

import { UserRewardEntity } from '@entities/user-reward.entity';
import { RewardAlreadyRedeemedException } from '@exceptions/reward-already-redeemed';
import { UserRewardNotFoundException } from '@exceptions/user-reward-not-found';

import { CreateUserRewardDto } from './dto/create-user-reward.dto';
import { UserRewardRepository } from './user-reward.repository';

@Injectable()
export class UserRewardService {
  constructor(private readonly userRewardRepository: UserRewardRepository) {}

  async getById(id: string): Promise<UserRewardEntity> {
    return await this.userRewardRepository.findById(id);
  }

  async createUserReward(dto: CreateUserRewardDto): Promise<UserRewardEntity> {
    return await this.userRewardRepository.createUserReward(dto);
  }

  async saveUserReward(
    userReward: UserRewardEntity,
  ): Promise<UserRewardEntity> {
    return await this.userRewardRepository.save(userReward);
  }

  async getByUserIdAndRewardId(
    userId: string,
    rewardId: string,
  ): Promise<UserRewardEntity> {
    return await this.userRewardRepository.findByUserIdAndRewardId(
      userId,
      rewardId,
    );
  }

  async redeemUserReward(
    qrCode: string,
  ): Promise<{ userReward: UserRewardEntity; count: number }> {
    let userReward = await this.userRewardRepository.findByQRCode(qrCode);

    if (!userReward) {
      throw new UserRewardNotFoundException();
    }

    if (userReward.isRedeemed) {
      throw new RewardAlreadyRedeemedException();
    }

    userReward.isRedeemed = true;
    userReward = await this.userRewardRepository.save(userReward);

    const rewards = await this.userRewardRepository.findByRewardId(
      userReward.reward.id,
    );

    return { userReward, count: rewards.length };
  }

  async getByRewardId(rewardId: string): Promise<UserRewardEntity[]> {
    return await this.userRewardRepository.findByRewardId(rewardId);
  }

  async getUnredeemedByUserIdAndRewardId(
    userId: string,
    rewardId: string,
  ): Promise<UserRewardEntity> {
    const result = await this.userRewardRepository.findOne({
      relations: ['user', 'reward'],
      where: {
        user: { id: userId },
        reward: { id: rewardId },
        isRedeemed: false,
      },
    });
    return result;
  }
}
