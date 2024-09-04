import { IsObject, IsOptional, IsString } from 'class-validator';

import { RewardEntity } from '@entities/reward.entity';
import { RewardDiscountEntity } from '@entities/reward-discount.entity';
import { UserEntity } from '@entities/user.entity';

export class CreateUserRewardDto {
  @IsOptional()
  @IsString()
  transaction?: string;

  @IsObject()
  user: UserEntity;

  @IsObject()
  reward: RewardEntity;

  @IsOptional()
  @IsObject()
  discount?: RewardDiscountEntity;

  @IsOptional()
  @IsObject()
  isClaimed?: boolean;

  @IsOptional()
  @IsObject()
  isRedeemed?: boolean;

  @IsOptional()
  @IsString()
  qrCode?: string;
}
