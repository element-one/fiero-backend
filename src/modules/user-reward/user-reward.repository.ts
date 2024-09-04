import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserRewardEntity } from '@entities/user-reward.entity';

import { CreateUserRewardDto } from './dto/create-user-reward.dto';

@Injectable()
export class UserRewardRepository extends Repository<UserRewardEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserRewardEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<UserRewardEntity> {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  async findByUserIdAndRewardId(
    userId: string,
    rewardId: string,
  ): Promise<UserRewardEntity> {
    const result = await this.findOne({
      relations: ['user', 'reward', 'discount', 'delivery', 'rewardSpin'],
      where: { user: { id: userId }, reward: { id: rewardId } },
    });
    return result;
  }

  async findByQRCode(qrCode: string): Promise<UserRewardEntity> {
    const result = await this.findOne({
      relations: ['user', 'reward'],
      where: { qrCode },
    });
    return result;
  }

  async findByRewardId(rewardId: string): Promise<UserRewardEntity[]> {
    const result = await this.find({
      relations: ['user', 'reward', 'discount', 'delivery'],
      where: { reward: { id: rewardId } },
    });
    return result;
  }

  async createUserReward(dto: CreateUserRewardDto): Promise<UserRewardEntity> {
    const result = this.create({ ...dto });
    return await this.save(result);
  }
}
