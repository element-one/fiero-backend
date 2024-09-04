import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserBadgeEntity } from '@entities/user-badge.entity';

import { UserBadgeRepository } from './user-badge.repository';
import { UserBadgeService } from './user-badge.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserBadgeEntity])],
  controllers: [],
  providers: [UserBadgeService, UserBadgeRepository],
  exports: [UserBadgeService],
})
export class UserBadgeModule {}
