import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { TikTokProfileDto } from './tiktok-profile.dto';

export class TikTokProfileResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  profile: TikTokProfileDto;
}
