import { IsOptional, IsString } from 'class-validator';

import { UserEntity } from '@entities/user.entity';

export class CreateUserSocialDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  socialId?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsString()
  type: string;

  @IsString()
  code: string;

  @IsString()
  token?: string;

  @IsOptional()
  user?: UserEntity;
}
