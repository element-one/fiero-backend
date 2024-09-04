import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialVerifyDto {
  @ApiProperty()
  @IsString()
  readonly socialId: string;

  @ApiProperty()
  @IsString()
  readonly code: string;
}
