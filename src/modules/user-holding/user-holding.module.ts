import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserHoldingEntity } from '@entities/user-holding.entity';

import { UserHoldingRepository } from './user-holding.repository';
import { UserHoldingService } from './user-holding.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserHoldingEntity])],
  controllers: [],
  providers: [UserHoldingService, UserHoldingRepository],
  exports: [UserHoldingService],
})
export class UserHoldingModule {}
