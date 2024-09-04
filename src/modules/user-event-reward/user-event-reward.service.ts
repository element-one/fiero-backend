import { Injectable } from '@nestjs/common';

import { UserEventRewardEntity } from '@entities/user-event-reward.entity';
import { EventRewardAlreadyRedeemedException } from '@exceptions/event-reward-already-redeemed';
import { UserEventRewardNotFoundException } from '@exceptions/user-event-reward-not-found';

import { CreateUserEventRewardDto } from './dto/create-user-event-reward.dto';
import { UserEventRewardRepository } from './user-event-reward.repository';

@Injectable()
export class UserEventRewardService {
  constructor(
    private readonly userEventRewardRepository: UserEventRewardRepository,
  ) {}

  async getById(id: string): Promise<UserEventRewardEntity> {
    return await this.userEventRewardRepository.findById(id);
  }

  async createUserEventReward(
    dto: CreateUserEventRewardDto,
  ): Promise<UserEventRewardEntity> {
    return await this.userEventRewardRepository.createUserEventReward(dto);
  }

  async saveUserEventReward(
    userEventReward: UserEventRewardEntity,
  ): Promise<UserEventRewardEntity> {
    return await this.userEventRewardRepository.save(userEventReward);
  }

  async getByUserIdAndEventRewardId(
    userId: string,
    eventRewardId: string,
  ): Promise<UserEventRewardEntity> {
    return await this.userEventRewardRepository.findByUserIdAndEventRewardId(
      userId,
      eventRewardId,
    );
  }

  async getUnredeemedByUserIdAndEventRewardId(
    userId: string,
    eventRewardId: string,
  ): Promise<UserEventRewardEntity> {
    return await this.userEventRewardRepository.findUnredeemedByUserIdAndEventRewardId(
      userId,
      eventRewardId,
    );
  }

  async getByUserId(userId: string): Promise<UserEventRewardEntity[]> {
    return await this.userEventRewardRepository.findByUserId(userId);
  }

  async getByEventRewardId(rewardId: string): Promise<UserEventRewardEntity[]> {
    return await this.userEventRewardRepository.findByEventRewardId(rewardId);
  }

  async redeemUserEventReward(
    qrCode: string,
  ): Promise<{ userEventReward: UserEventRewardEntity; count: number }> {
    let userEventReward = await this.userEventRewardRepository.findByQRCode(
      qrCode,
    );

    if (!userEventReward) {
      throw new UserEventRewardNotFoundException();
    }

    if (userEventReward.isRedeemed) {
      throw new EventRewardAlreadyRedeemedException();
    }

    userEventReward.isRedeemed = true;
    userEventReward = await this.userEventRewardRepository.save(
      userEventReward,
    );

    const rewards = await this.userEventRewardRepository.findByEventRewardId(
      userEventReward.eventReward.id,
    );

    return { userEventReward, count: rewards.length };
  }
}
