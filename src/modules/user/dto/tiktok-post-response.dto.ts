import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { TikTokPostDto } from './tiktok-post.dto';

export class TikTokPostResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  posts: TikTokPostDto[];
}
