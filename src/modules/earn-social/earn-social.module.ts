import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EarnSocialEntity } from '@entities/earn-social.entity';

import { EarnSocialRepository } from './earn-social.repository';
import { EarnSocialService } from './earn-social.service';

@Module({
  imports: [TypeOrmModule.forFeature([EarnSocialEntity]), HttpModule],
  controllers: [],
  providers: [EarnSocialService, EarnSocialRepository],
  exports: [EarnSocialService],
})
export class EarnSocialModule {}
