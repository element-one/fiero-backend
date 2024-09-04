import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsObject, IsOptional } from 'class-validator';

import { UserEntity } from '@entities/user.entity';

export class CreateReferralDto {
  @IsNumber()
  points: number;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsObject()
  referrer: UserEntity;

  @IsOptional()
  @IsObject()
  referral?: UserEntity;
}
