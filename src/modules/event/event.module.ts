import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { EventRewardModule } from '@modules/event-reward/event-reward.module';
import { EventRewardCustomModule } from '@modules/event-reward-custom/event-reward-custom.module';
import { EventRewardRaffleModule } from '@modules/event-reward-raffle/event-reward-raffle.module';
import { EventUserModule } from '@modules/event-user/event-user.module';
import { UserModule } from '@modules/user/user.module';
import { UserEventRewardModule } from '@modules/user-event-reward/user-event-reward.module';

import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
    forwardRef(() => EventRewardModule),
    UserEventRewardModule,
    EventRewardRaffleModule,
    EventRewardCustomModule,
    EventUserModule,
  ],
  providers: [EventService, EventRepository],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
