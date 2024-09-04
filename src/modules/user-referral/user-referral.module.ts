import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserReferralEntity } from '@entities/user-referral.entity';

import { UserReferralRepository } from './user-referral.repository';
import { UserReferralService } from './user-referral.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserReferralEntity])],
  controllers: [],
  providers: [UserReferralService, UserReferralRepository],
  exports: [UserReferralService],
})
export class UserReferralModule {}
