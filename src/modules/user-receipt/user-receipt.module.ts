import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserReceiptEntity } from '@entities/user-receipt.entity';

import { UserReceiptRepository } from './user-receipt.repository';
import { UserReceiptService } from './user-receipt.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserReceiptEntity])],
  controllers: [],
  providers: [UserReceiptService, UserReceiptRepository],
  exports: [UserReceiptService],
})
export class UserReceiptModule {}
