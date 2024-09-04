import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { EventDto } from './event.dto';

export class EventsResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  event: EventDto;
}
