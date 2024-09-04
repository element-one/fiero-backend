import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserEventRewardEntity } from '@entities/user-event-reward.entity';

import { CreateUserEventRewardDto } from './dto/create-user-event-reward.dto';

@Injectable()
export class UserEventRewardRepository extends Repository<UserEventRewardEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEventRewardEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<UserEventRewardEntity> {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  async findByUserIdAndEventRewardId(
    userId: string,
    eventRewardId: string,
  ): Promise<UserEventRewardEntity> {
    const result = await this.findOne({
      relations: ['user', 'eventReward'],
      where: {
        user: { id: userId },
        eventReward: { id: eventRewardId },
      },
    });
    return result;
  }

  async findUnredeemedByUserIdAndEventRewardId(
    userId: string,
    eventRewardId: string,
  ): Promise<UserEventRewardEntity> {
    const result = await this.findOne({
      relations: ['user', 'eventReward'],
      where: {
        user: { id: userId },
        eventReward: { id: eventRewardId },
        isRedeemed: false,
      },
    });
    return result;
  }

  async findByUserId(userId: string): Promise<UserEventRewardEntity[]> {
    const result = await this.find({
      relations: ['user', 'eventReward'],
      where: { user: { id: userId } },
    });
    return result;
  }

  async findByQRCode(qrCode: string): Promise<UserEventRewardEntity> {
    const result = await this.findOne({
      relations: ['user', 'eventReward'],
      where: { qrCode },
    });
    return result;
  }

  async findByEventRewardId(
    eventRewardId: string,
  ): Promise<UserEventRewardEntity[]> {
    const result = await this.find({
      relations: ['user', 'eventReward'],
      where: { eventReward: { id: eventRewardId } },
    });
    return result;
  }

  async createUserEventReward(
    dto: CreateUserEventRewardDto,
  ): Promise<UserEventRewardEntity> {
    const result = this.create({ ...dto });
    return await this.save(result);
  }
}
