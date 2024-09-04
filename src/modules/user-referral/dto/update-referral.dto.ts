import { IsBoolean, IsObject } from 'class-validator';

import { UserEntity } from '@entities/user.entity';

export class UpdateReferralDto {
  @IsBoolean()
  isAccepted: boolean;

  @IsBoolean()
  isClaimed: boolean;

  @IsBoolean()
  isAirdropped: boolean;

  @IsBoolean()
  isAirdropAttempted: boolean;

  @IsObject()
  referral: UserEntity;
}
