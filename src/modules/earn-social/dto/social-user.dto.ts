import { IsString } from 'class-validator';

export class SocialUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly username: string;

  @IsString()
  readonly userId: string;

  @IsString()
  readonly profileImageUrl: string;
}
