import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

import { RewardDiscountEntity } from '@entities/reward-discount.entity';
import { RewardDto } from '@modules/reward/dto/reward.dto';
import { UserRewardDto } from '@modules/user-reward/dto/user-reward.dto';

export class DiscountDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsObject()
  userReward: UserRewardDto;

  @ApiProperty()
  @IsObject()
  reward: RewardDto;

  constructor(discount: RewardDiscountEntity) {
    this.id = discount.id;
    this.code = discount.code;
    this.userReward =
      discount.userReward && new UserRewardDto(discount.userReward);
    this.reward = discount.reward && new RewardDto(discount.reward);
  }
}
