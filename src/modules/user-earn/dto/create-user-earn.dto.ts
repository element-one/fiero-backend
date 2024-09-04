import { IsBoolean, IsObject, IsOptional } from 'class-validator';

import { EarnEntity } from '@entities/earn.entity';
import { UserEntity } from '@entities/user.entity';
import { UserReceiptEntity } from '@entities/user-receipt.entity';
import { JSONObject } from '@type/common';

export class CreateUserEarnDto {
  @IsOptional()
  @IsBoolean()
  isPending?: boolean;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  isClaimed?: boolean;

  @IsOptional()
  @IsBoolean()
  isAirdropped?: boolean;

  @IsOptional()
  @IsObject()
  answers?: JSONObject;

  userReceipt?: UserReceiptEntity;

  user: UserEntity;

  earn: EarnEntity;
}
