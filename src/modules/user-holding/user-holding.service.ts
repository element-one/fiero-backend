import { Injectable } from '@nestjs/common';

import { UserHoldingEntity } from '@entities/user-holding.entity';

import { CreateUserHoldingDto } from './dto/create-user-holding.dto';
import { UserHoldingRepository } from './user-holding.repository';

@Injectable()
export class UserHoldingService {
  constructor(private readonly userHoldingRepository: UserHoldingRepository) {}

  async getById(id: string): Promise<UserHoldingEntity> {
    return await this.userHoldingRepository.findById(id);
  }

  async createUserHolding(
    dto: CreateUserHoldingDto,
  ): Promise<UserHoldingEntity> {
    return await this.userHoldingRepository.createUserHolding(dto);
  }

  async saveUserHolding(
    userHolding: UserHoldingEntity,
  ): Promise<UserHoldingEntity> {
    return await this.userHoldingRepository.save(userHolding);
  }

  async getByUserIdAndBrandId(
    userId: string,
    brandId: string,
  ): Promise<UserHoldingEntity> {
    return await this.userHoldingRepository.findByUserIdAndBrandId(
      userId,
      brandId,
    );
  }
}
