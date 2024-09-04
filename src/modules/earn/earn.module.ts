import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { BadgeModule } from '@modules/badge/badge.module';
import { EarnSocialModule } from '@modules/earn-social/earn-social.module';
import { OpenAiModule } from '@modules/openai/openai.module';
import { UserModule } from '@modules/user/user.module';
import { UserBadgeModule } from '@modules/user-badge/user-badge.module';
import { UserBonusModule } from '@modules/user-bonus/user-bonus.module';
import { UserEarnModule } from '@modules/user-earn/user-earn.module';
import { UserHoldingModule } from '@modules/user-holding/user-holding.module';
import { UserReceiptModule } from '@modules/user-receipt/user-receipt.module';
import { UserReferralModule } from '@modules/user-referral/user-referral.module';
import { S3Service } from '@services/aws/s3.service';
import { SesService } from '@services/aws/ses.service';

import { EarnController } from './earn.controller';
import { EarnRepository } from './earn.repository';
import { EarnService } from './earn.service';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EarnSocialModule,
    BadgeModule,
    forwardRef(() => UserModule),
    UserEarnModule,
    UserBadgeModule,
    UserHoldingModule,
    UserReferralModule,
    UserBonusModule,
    OpenAiModule,
    UserReceiptModule,
  ],
  providers: [EarnService, EarnRepository, SesService, S3Service],
  controllers: [EarnController],
  exports: [EarnService],
})
export class EarnModule {}
