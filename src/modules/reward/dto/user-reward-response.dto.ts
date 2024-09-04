import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { UserRewardEntity } from '@entities/user-reward.entity';

export class UserRewardResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  userReward: UserRewardEntity;
}
