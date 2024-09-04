import { IsOptional, IsString } from 'class-validator';

import { SocialUserDto } from './social-user.dto';

export class SocialAccountDto {
  @IsOptional()
  userId?: string;

  @IsString()
  user: SocialUserDto;

  @IsString()
  socialType: string;
}
