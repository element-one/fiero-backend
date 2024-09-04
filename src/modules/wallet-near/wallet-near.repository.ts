import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { WalletNearEntity } from '@entities/wallet-near.entity';

@Injectable()
export class WalletNearRepository extends Repository<WalletNearEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(WalletNearEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<WalletNearEntity> {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  async findByUnassigned(): Promise<WalletNearEntity> {
    const result = await this.findOne({
      where: { isAssigned: false },
    });
    return result;
  }

  async updateAssigned(id: string): Promise<void> {
    await this.update(id, { isAssigned: true });
  }
}
