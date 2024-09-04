import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

import { EventRewardEntity } from '@entities/event-reward.entity';
import { UserEntity } from '@entities/user.entity';

export class CreateUserEventRewardDto {
  @IsObject()
  user: UserEntity;

  @IsObject()
  eventReward: EventRewardEntity;

  @IsBoolean()
  isClaimed: boolean;

  @IsOptional()
  @IsString()
  qrCode?: string;
}
