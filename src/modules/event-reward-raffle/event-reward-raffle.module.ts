import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@modules/user/user.module';

import { EventRewardRaffleRepository } from './event-reward-raffle.repository';
import { EventRewardRaffleService } from './event-reward-raffle.service';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
  ],
  providers: [EventRewardRaffleService, EventRewardRaffleRepository],
  controllers: [],
  exports: [EventRewardRaffleService],
})
export class EventRewardRaffleModule {}
