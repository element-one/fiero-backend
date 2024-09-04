import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RewardSpinEntity } from '@entities/reward-spin.entity';

@Injectable()
export class RewardSpinRepository extends Repository<RewardSpinEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RewardSpinEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<RewardSpinEntity> {
    const raffle = await this.findOne({
      where: { id },
      relations: ['reward', 'user'],
    });
    return raffle;
  }
}
