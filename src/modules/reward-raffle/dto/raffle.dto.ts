import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { RewardRaffleEntity } from '@entities/reward-raffle.entity';

export class RaffleDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rewardName: string;

  @ApiProperty()
  @IsNumber()
  token: number;

  constructor(raffle: RewardRaffleEntity) {
    this.id = raffle.id;
    this.token = raffle.token;
    this.email = raffle.user?.email;
    this.name = raffle.user?.name;
    this.rewardName = raffle.reward?.name;
  }
}
