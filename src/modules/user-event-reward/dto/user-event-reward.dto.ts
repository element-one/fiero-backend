import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsString } from 'class-validator';

import { UserEventRewardEntity } from '@entities/user-event-reward.entity';
import { EventRewardDto } from '@modules/event-reward/dto/event-reward.dto';
import { RewardDto } from '@modules/reward/dto/reward.dto';
import { UserDto } from '@modules/user/dto/user.dto';

export class UserEventRewardDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsBoolean()
  isClaimed: boolean;

  @ApiProperty()
  @IsBoolean()
  isRedeemed: boolean;

  @ApiProperty()
  @IsString()
  qrCode: string;

  @ApiProperty()
  @IsObject()
  user: UserDto;

  @ApiProperty()
  @IsObject()
  reward: RewardDto;

  constructor(eventReward: UserEventRewardEntity) {
    this.id = eventReward.id;
    this.isClaimed = eventReward.isClaimed;
    this.isClaimed = eventReward.isClaimed;
    this.user = eventReward.user && new UserDto(eventReward.user);
    this.reward =
      eventReward.eventReward && new EventRewardDto(eventReward.eventReward);
  }
}
