import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { EventModule } from '@modules/event/event.module';
import { EventRewardRaffleModule } from '@modules/event-reward-raffle/event-reward-raffle.module';
import { UserModule } from '@modules/user/user.module';
import { UserEventRewardModule } from '@modules/user-event-reward/user-event-reward.module';
import { UserHoldingModule } from '@modules/user-holding/user-holding.module';
import { SesService } from '@services/aws/ses.service';

import { EventRewardRepository } from './event-reward.repository';
import { EventRewardService } from './event-reward.service';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
    UserEventRewardModule,
    UserHoldingModule,
    EventRewardRaffleModule,
    forwardRef(() => EventModule),
  ],
  providers: [EventRewardService, EventRewardRepository, SesService],
  controllers: [],
  exports: [EventRewardService],
})
export class EventRewardModule {}
