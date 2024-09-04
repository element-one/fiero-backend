import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '@dtos/page';

export class RaffleParamsDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  eventId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRedraw: boolean;
}
