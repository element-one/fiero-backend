import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RewardCustomEntity } from '@entities/reward-custom.entity';

import { AddCustomDto } from './dto/add-custom.dto';

@Injectable()
export class RewardCustomRepository extends Repository<RewardCustomEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RewardCustomEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<RewardCustomEntity> {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  async createCustom(dto: AddCustomDto): Promise<RewardCustomEntity> {
    const result = this.create({ ...dto });
    return await this.save(result);
  }
}
