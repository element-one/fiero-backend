import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { RewardCustomModule } from '@modules/reward-custom/reward-custom.module';
import { DeliveryModule } from '@modules/reward-delivery/delivery.module';
import { DiscountModule } from '@modules/reward-discount/discount.module';
import { RewardRaffleModule } from '@modules/reward-raffle/reward-raffle.module';
import { RewardSpinModule } from '@modules/reward-spin/reward-spin.module';
import { UserModule } from '@modules/user/user.module';
import { UserHoldingModule } from '@modules/user-holding/user-holding.module';
import { UserRewardModule } from '@modules/user-reward/user-reward.module';
import { SesService } from '@services/aws/ses.service';

import { RewardController } from './reward.controller';
import { RewardRepository } from './reward.repository';
import { RewardService } from './reward.service';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
    UserRewardModule,
    UserHoldingModule,
    DiscountModule,
    DeliveryModule,
    RewardCustomModule,
    RewardRaffleModule,
    RewardSpinModule,
  ],
  providers: [RewardService, RewardRepository, SesService],
  controllers: [RewardController],
  exports: [RewardService],
})
export class RewardModule {}
