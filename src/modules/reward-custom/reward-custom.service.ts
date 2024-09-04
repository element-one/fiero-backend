import { Injectable } from '@nestjs/common';

import { RewardCustomEntity } from '@entities/reward-custom.entity';

import { AddCustomDto } from './dto/add-custom.dto';
import { RewardCustomRepository } from './reward-custom.repository';

@Injectable()
export class RewardCustomService {
  constructor(
    private readonly rewardCustomRepository: RewardCustomRepository,
  ) {}

  async getById(id: string): Promise<RewardCustomEntity> {
    return await this.rewardCustomRepository.findById(id);
  }

  async getByRewardId(id: string): Promise<RewardCustomEntity> {
    return await this.rewardCustomRepository.findOne({
      relations: ['userReward'],
      where: { userReward: { id } },
    });
  }

  async createCustom(dto: AddCustomDto): Promise<RewardCustomEntity> {
    const delivery = await this.rewardCustomRepository.createCustom(dto);
    return await this.rewardCustomRepository.save(delivery);
  }

  async saveCustom(delivery: RewardCustomEntity): Promise<RewardCustomEntity> {
    return await this.rewardCustomRepository.save(delivery);
  }
}
