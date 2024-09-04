import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { EventRewardRaffleEntity } from '@entities/event-reward-raffle.entity';

export class EventRaffleResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  eventRaffle: EventRewardRaffleEntity;
}
