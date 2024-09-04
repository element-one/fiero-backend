import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletNearEntity } from '@entities/wallet-near.entity';

import { WalletNearRepository } from './wallet-near.repository';
import { WalletNearService } from './wallet-near.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletNearEntity]), HttpModule],
  controllers: [],
  providers: [WalletNearService, WalletNearRepository],
  exports: [WalletNearService],
})
export class WalletNearModule {}
