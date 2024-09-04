import { IsOptional, IsString } from 'class-validator';

import { UserEntity } from '@entities/user.entity';

export class CreateUserLoginDto {
  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  ip?: string;

  user: UserEntity;
}
