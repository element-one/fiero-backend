import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BadgeEntity } from '@entities/badge.entity';

import { BadgeRepository } from './badge.repository';
import { BadgeService } from './badge.service';

@Module({
  imports: [TypeOrmModule.forFeature([BadgeEntity])],
  controllers: [],
  providers: [BadgeService, BadgeRepository],
  exports: [BadgeService],
})
export class BadgeModule {}
