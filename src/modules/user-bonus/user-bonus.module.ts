import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserBonusEntity } from '@entities/user-bonus.entity';

import { UserBonusRepository } from './user-bonus.repository';
import { UserBonusService } from './user-bonus.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserBonusEntity])],
  controllers: [],
  providers: [UserBonusService, UserBonusRepository],
  exports: [UserBonusService],
})
export class UserBonusModule {}
