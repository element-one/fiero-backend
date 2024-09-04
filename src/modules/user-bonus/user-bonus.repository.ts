import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserBonusEntity } from '@entities/user-bonus.entity';

import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';

@Injectable()
export class UserBonusRepository extends Repository<UserBonusEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserBonusEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<UserBonusEntity> {
    const result = await this.findOne({ relations: ['user'], where: { id } });
    return result;
  }

  async findByUserId(userId: string): Promise<UserBonusEntity> {
    const result = await this.findOne({
      relations: ['user'],
      where: { user: { id: userId } },
    });
    return result;
  }

  async createBonus(dto: CreateBonusDto): Promise<UserBonusEntity> {
    const result = this.create({ ...dto });
    return await this.save(result);
  }

  async updateBonus(
    bonusId: string,
    dto: UpdateBonusDto,
  ): Promise<UserBonusEntity> {
    await this.update(bonusId, dto);
    return await this.findById(bonusId);
  }
}
