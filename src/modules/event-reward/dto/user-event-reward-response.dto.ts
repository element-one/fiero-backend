import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { UserEventRewardEntity } from '@entities/user-event-reward.entity';

export class UserEventRewardResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  userEventReward: UserEventRewardEntity;

  @ApiProperty()
  @IsNotEmpty()
  count?: number;
}
