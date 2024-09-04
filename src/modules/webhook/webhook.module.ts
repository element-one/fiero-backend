import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BadgeModule } from '@modules/badge/badge.module';
import { EarnModule } from '@modules/earn/earn.module';
import { EarnSocialModule } from '@modules/earn-social/earn-social.module';
import { UserModule } from '@modules/user/user.module';
import { UserBadgeModule } from '@modules/user-badge/user-badge.module';
import { UserEarnModule } from '@modules/user-earn/user-earn.module';
import { SesService } from '@services/aws/ses.service';
import { CoCreateService } from '@services/cocreate/cocreate.service';
import { NearService } from '@services/near/near.service';
import { UtilsService } from '@services/utils/utils.service';

import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [
    HttpModule,
    UserModule,
    BadgeModule,
    EarnModule,
    UserEarnModule,
    UserBadgeModule,
    EarnSocialModule,
  ],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    UtilsService,
    CoCreateService,
    NearService,
    SesService,
  ],
  exports: [WebhookService],
})
export class WebhookModule {}
