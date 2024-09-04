import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

import { RewardCustomEntity } from '@entities/reward-custom.entity';
import { UserRewardDto } from '@modules/user-reward/dto/user-reward.dto';

export class CustomDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsObject()
  userReward: UserRewardDto;

  constructor(customer: RewardCustomEntity) {
    this.id = customer.id;
    this.name = customer.name;
    this.email = customer.email;
    this.userReward =
      customer.userReward && new UserRewardDto(customer.userReward);
  }
}
