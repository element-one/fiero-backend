import { IsBoolean, IsNumber, IsObject } from 'class-validator';

import { UserEntity } from '@entities/user.entity';

export class CreateBonusDto {
  @IsNumber()
  points: number;

  @IsObject()
  user: UserEntity;

  @IsBoolean()
  isCompleted: boolean;
}
