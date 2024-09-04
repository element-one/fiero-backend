import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { UserEventRewardEntity } from '@entities/user-event-reward.entity';

export class UserEventRewardsResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  userEventRewards: UserEventRewardEntity[];
}
