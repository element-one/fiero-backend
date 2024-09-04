import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PageOptionsDto } from '@dtos/page';
import { EventTypeEnum, LocationEnum } from '@type/enum';

export class EventParamsDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  slug: string;

  @ApiPropertyOptional({ enum: LocationEnum })
  @IsOptional()
  location?: LocationEnum;

  @ApiPropertyOptional({ enum: EventTypeEnum })
  @IsOptional()
  type?: EventTypeEnum;
}
