import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserBadgeEntity } from '@entities/user-badge.entity';

import { CreateUserBadgeDto } from './dto/create-user-badge.dto';

@Injectable()
export class UserBadgeRepository extends Repository<UserBadgeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserBadgeEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<UserBadgeEntity> {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  async findByUserIdAndBadgeId(
    userId: string,
    badgeId: string,
  ): Promise<UserBadgeEntity> {
    const result = await this.findOne({
      relations: ['user', 'badge'],
      where: { user: { id: userId }, badge: { id: badgeId } },
    });
    return result;
  }

  async createUserBadge(dto: CreateUserBadgeDto): Promise<UserBadgeEntity> {
    const result = this.create({ ...dto });
    return await this.save(result);
  }

  async findUnAirdropped(): Promise<UserBadgeEntity[]> {
    const results = await this.find({
      relations: ['user', 'badge'],
      where: {
        isClaimed: true,
        isAirdropped: false,
        isAirdropAttempted: false,
      },
    });

    return results;
  }

  async findAttemptedAirdropped(): Promise<UserBadgeEntity[]> {
    const results = await this.find({
      relations: ['user', 'badge'],
      where: {
        isClaimed: true,
        isAirdropped: false,
        isAirdropAttempted: true,
      },
    });

    return results;
  }
}
