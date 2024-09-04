import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RewardEntity } from '@entities/reward.entity';

@Injectable()
export class RewardRepository extends Repository<RewardEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RewardEntity, dataSource.createEntityManager());
  }

  getQueryRunner() {
    return this.dataSource.createQueryRunner();
  }

  async findById(id: string): Promise<RewardEntity> {
    const reward = await this.findOne({
      where: { id },
      relations: ['brand'],
    });
    return reward;
  }
}
