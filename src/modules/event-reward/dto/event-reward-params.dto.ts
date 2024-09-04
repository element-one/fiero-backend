import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PageOptionsDto } from '@dtos/page';

export class EventRewardParamsDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  isPopular: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  slug: string;
}
