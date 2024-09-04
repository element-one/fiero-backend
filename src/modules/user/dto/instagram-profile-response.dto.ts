import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { InstagramProfileDto } from './instagram-profile.dto';

export class InstagramProfileResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  profile: InstagramProfileDto;
}
