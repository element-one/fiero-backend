import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@modules/user/user.module';

import { RewardRaffleRepository } from './reward-raffle.repository';
import { RewardRaffleService } from './reward-raffle.service';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
  ],
  providers: [RewardRaffleService, RewardRaffleRepository],
  controllers: [],
  exports: [RewardRaffleService],
})
export class RewardRaffleModule {}
