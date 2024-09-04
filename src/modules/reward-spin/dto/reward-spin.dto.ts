import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { RewardSpinEntity } from '@entities/reward-spin.entity';

export class RewardSpinDto {
  @ApiProperty()
  @IsString()
  id: string;

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

  constructor(rewardSpin: RewardSpinEntity) {
    this.id = rewardSpin.id;
    this.spinNumber = rewardSpin.spinNumber;
    this.name = rewardSpin.name;
    this.isWinner = rewardSpin.isWinner;
  }
}
