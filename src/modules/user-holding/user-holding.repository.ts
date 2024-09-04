import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserHoldingEntity } from '@entities/user-holding.entity';

import { CreateUserHoldingDto } from './dto/create-user-holding.dto';

@Injectable()
export class UserHoldingRepository extends Repository<UserHoldingEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserHoldingEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<UserHoldingEntity> {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  async findByUserIdAndBrandId(
    userId: string,
    brandId: string,
  ): Promise<UserHoldingEntity> {
    const result = await this.findOne({
      relations: ['user', 'brand'],
      where: { user: { id: userId }, brand: { id: brandId } },
    });
    return result;
  }

  async createUserHolding(
    dto: CreateUserHoldingDto,
  ): Promise<UserHoldingEntity> {
    const result = this.create({ ...dto });
    return await this.save(result);
  }
}
