import { IsNumber } from 'class-validator';

import { BrandEntity } from '@entities/brand.entity';
import { UserEntity } from '@entities/user.entity';

export class CreateUserHoldingDto {
  @IsNumber()
  points: number;

  user: UserEntity;

  brand: BrandEntity;
}
