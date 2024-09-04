import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { RewardEntity } from '@entities/reward.entity';

export class RewardDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  restriction: string;

  @ApiProperty()
  states: any;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  points: number;

  constructor(reward: RewardEntity) {
    this.id = reward.id;
    this.name = reward.name;
    this.description = reward.description;
    this.imageUrl = reward.imageUrl;
  }
}
