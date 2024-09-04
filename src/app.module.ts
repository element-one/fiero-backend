import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from '@config/app.config';
import { AuthModule } from '@modules/auth/auth.module';
import { BadgeModule } from '@modules/badge/badge.module';
import { EarnModule } from '@modules/earn/earn.module';
import { EarnSocialModule } from '@modules/earn-social/earn-social.module';
import { EarnSurveyModule } from '@modules/earn-survey/earn-survey.module';
import { EventModule } from '@modules/event/event.module';
import { EventRewardModule } from '@modules/event-reward/event-reward.module';
import { EventRewardCustomModule } from '@modules/event-reward-custom/event-reward-custom.module';
import { EventRewardRaffleModule } from '@modules/event-reward-raffle/event-reward-raffle.module';
import { EventUserModule } from '@modules/event-user/event-user.module';
import { LoginOtpModule } from '@modules/login-otp/login-otp.module';
import { MetadataModule } from '@modules/metadata/metadata.module';
import { OpenAiModule } from '@modules/openai/openai.module';
import { RewardModule } from '@modules/reward/reward.module';
import { RewardCustomModule } from '@modules/reward-custom/reward-custom.module';
import { RewardRaffleModule } from '@modules/reward-raffle/reward-raffle.module';
import { RewardSpinModule } from '@modules/reward-spin/reward-spin.module';
import { UserModule } from '@modules/user/user.module';
import { UserEarnModule } from '@modules/user-earn/user-earn.module';
import { UserEventRewardModule } from '@modules/user-event-reward/user-event-reward.module';
import { UserReceiptModule } from '@modules/user-receipt/user-receipt.module';
import { UserSocialModule } from '@modules/user-social/user-social.module';
import { WebhookModule } from '@modules/webhook/webhook.module';

import { BrandModule } from './modules/brand/brand.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return configService.get('database');
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    EarnModule,
    RewardModule,
    UserSocialModule,
    BrandModule,
    UserEarnModule,
    EarnSocialModule,
    EarnSurveyModule,
    WebhookModule,
    BadgeModule,
    MetadataModule,
    EventModule,
    EventRewardModule,
    EventRewardRaffleModule,
    UserEventRewardModule,
    RewardCustomModule,
    EventRewardCustomModule,
    LoginOtpModule,
    OpenAiModule,
    UserReceiptModule,
    EventUserModule,
    RewardRaffleModule,
    RewardSpinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
