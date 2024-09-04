import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@entities/user.entity';
import { BrandModule } from '@modules/brand/brand.module';
import { RewardModule } from '@modules/reward/reward.module';
import { UserBonusModule } from '@modules/user-bonus/user-bonus.module';
import { UserEarnModule } from '@modules/user-earn/user-earn.module';
import { UserHoldingModule } from '@modules/user-holding/user-holding.module';
import { UserReferralModule } from '@modules/user-referral/user-referral.module';
import { UserRewardModule } from '@modules/user-reward/user-reward.module';
import { UserSocialModule } from '@modules/user-social/user-social.module';
import { WalletNearModule } from '@modules/wallet-near/wallet-near.module';
import { S3Service } from '@services/aws/s3.service';
import { SesService } from '@services/aws/ses.service';
import { HubspotService } from '@services/hubspot/hubspot.service';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    HttpModule,
    BrandModule,
    UserReferralModule,
    UserBonusModule,
    UserSocialModule,
    UserEarnModule,
    UserHoldingModule,
    WalletNearModule,
    RewardModule,
    UserRewardModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    S3Service,
    SesService,
    HubspotService,
  ],
  exports: [UserService],
})
export class UserModule {}
