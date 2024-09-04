import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { UserBadgeEntity } from '@entities/user-badge.entity';

export class UserBadgesResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  badges: UserBadgeEntity[];
}
