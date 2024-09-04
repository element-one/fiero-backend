import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { EventRewardRaffleEntity } from '@entities/event-reward-raffle.entity';

export class EventRaffleDto {
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
  eventName: string;

  @ApiProperty()
  @IsNumber()
  token: number;

  constructor(eventRaffle: EventRewardRaffleEntity) {
    this.id = eventRaffle.id;
    this.token = eventRaffle.token;
    this.email = eventRaffle.user?.email;
    this.name = eventRaffle.user?.name;
    this.eventName = eventRaffle.event?.name;
  }
}
