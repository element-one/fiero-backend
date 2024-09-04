import { Injectable } from '@nestjs/common';

import { UserBonusEntity } from '@entities/user-bonus.entity';

import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { UserBonusRepository } from './user-bonus.repository';

@Injectable()
export class UserBonusService {
  constructor(private readonly userBonusRepository: UserBonusRepository) {}

  async getById(id: string): Promise<UserBonusEntity> {
    return await this.userBonusRepository.findById(id);
  }

  async getByUserId(userId: string): Promise<UserBonusEntity> {
    return await this.userBonusRepository.findByUserId(userId);
  }

  async createBonus(dto: CreateBonusDto): Promise<UserBonusEntity> {
    return await this.userBonusRepository.createBonus(dto);
  }

  async updateBonus(
    bonusId: string,
    dto: UpdateBonusDto,
  ): Promise<UserBonusEntity> {
    return await this.userBonusRepository.updateBonus(bonusId, dto);
  }

  async saveBonus(bonus: UserBonusEntity): Promise<UserBonusEntity> {
    return await this.userBonusRepository.save(bonus);
  }
}
