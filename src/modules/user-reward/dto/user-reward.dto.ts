import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsString } from 'class-validator';

import { UserRewardEntity } from '@entities/user-reward.entity';
import { RewardDto } from '@modules/reward/dto/reward.dto';
import { UserDto } from '@modules/user/dto/user.dto';

export class UserRewardDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  transaction: string;

  @ApiProperty()
  @IsObject()
  user: UserDto;

  @ApiProperty()
  @IsObject()
  reward: RewardDto;

  @ApiProperty()
  @IsBoolean()
  isClaimed: boolean;

  @ApiProperty()
  @IsBoolean()
  isRedeemed: boolean;

  constructor(reward: UserRewardEntity) {
    this.id = reward.id;
    this.transaction = reward.transaction;
    this.isClaimed = reward.isClaimed;
    this.isRedeemed = reward.isRedeemed;
    this.user = reward.user && new UserDto(reward.user);
    this.reward = reward.reward && new RewardDto(reward.reward);
  }
}
