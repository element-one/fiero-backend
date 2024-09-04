import { Injectable } from '@nestjs/common';

import { UserBadgeEntity } from '@entities/user-badge.entity';

import { CreateUserBadgeDto } from './dto/create-user-badge.dto';
import { UserBadgeRepository } from './user-badge.repository';

@Injectable()
export class UserBadgeService {
  constructor(private readonly userBadgeRepository: UserBadgeRepository) {}

  async getById(id: string): Promise<UserBadgeEntity> {
    return await this.userBadgeRepository.findById(id);
  }

  async createUserBadge(dto: CreateUserBadgeDto): Promise<UserBadgeEntity> {
    return await this.userBadgeRepository.createUserBadge(dto);
  }

  async saveUserBadge(userEarn: UserBadgeEntity): Promise<UserBadgeEntity> {
    return await this.userBadgeRepository.save(userEarn);
  }

  async getByUserIdAndBadgeId(
    userId: string,
    badgeId: string,
  ): Promise<UserBadgeEntity> {
    return await this.userBadgeRepository.findByUserIdAndBadgeId(
      userId,
      badgeId,
    );
  }

  async getUnAirdropBadges(): Promise<UserBadgeEntity[]> {
    return await this.userBadgeRepository.findUnAirdropped();
  }

  async getAttemptedAirdropBadges(): Promise<UserBadgeEntity[]> {
    return await this.userBadgeRepository.findAttemptedAirdropped();
  }
}
