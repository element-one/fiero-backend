import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { InstagramPostDto } from './instagram-post.dto';

export class InstagramPostResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  posts: InstagramPostDto[];
}
