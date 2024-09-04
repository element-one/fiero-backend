import { IsBoolean, IsOptional } from 'class-validator';

import { BadgeEntity } from '@entities/badge.entity';
import { UserEntity } from '@entities/user.entity';

export class CreateUserBadgeDto {
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  isClaimed?: boolean;

  @IsOptional()
  @IsBoolean()
  isAirdropped?: boolean;

  user: UserEntity;

  badge: BadgeEntity;
}
