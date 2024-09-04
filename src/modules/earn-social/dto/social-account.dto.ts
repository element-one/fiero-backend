import { IsString } from 'class-validator';

import { SocialUserDto } from './social-user.dto';

export class SocialAccountDto {
  @IsString()
  readonly user: SocialUserDto;

  @IsString()
  readonly socialType: string;
}
