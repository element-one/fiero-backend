import { Injectable } from '@nestjs/common';

import { WalletNearEntity } from '@entities/wallet-near.entity';

import { WalletNearRepository } from './wallet-near.repository';

@Injectable()
export class WalletNearService {
  constructor(private readonly walletNearRepository: WalletNearRepository) {}

  async findUnassigned(): Promise<WalletNearEntity> {
    return await this.walletNearRepository.findByUnassigned();
  }

  async updateAssigned(id: string): Promise<void> {
    await this.walletNearRepository.updateAssigned(id);
  }
}
