import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';

import { UserModule } from '@modules/user/user.module';

import { RewardSpinRepository } from './reward-spin.repository';
import { RewardSpinService } from './reward-spin.service';

@Module({
  imports: [HttpModule, forwardRef(() => UserModule)],
  providers: [RewardSpinService, RewardSpinRepository],
  controllers: [],
  exports: [RewardSpinService],
})
export class RewardSpinModule {}
