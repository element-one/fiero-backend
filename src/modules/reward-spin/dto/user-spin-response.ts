import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { UserRewardDto } from '@modules/user-reward/dto/user-reward.dto';

export class UserSpinResponseDto {
  @ApiProperty()
  @IsNumber()
  spinNumber: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isWinner: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  userReward: UserRewardDto;
}
