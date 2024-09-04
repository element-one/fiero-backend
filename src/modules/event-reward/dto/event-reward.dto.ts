import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { EventRewardEntity } from '@entities/event-reward.entity';

export class EventRewardDto {
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

  constructor(eventReward: EventRewardEntity) {
    this.id = eventReward.id;
    this.name = eventReward.name;
    this.description = eventReward.description;
    this.imageUrl = eventReward.imageUrl;
  }
}
