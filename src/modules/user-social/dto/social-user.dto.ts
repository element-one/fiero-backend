import { IsString } from 'class-validator';

export class SocialUserDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  userId: string;

  @IsString()
  profileImageUrl: string;

  @IsString()
  token?: string;
}
