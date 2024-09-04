import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { PageOptionsDto } from '@dtos/page';

export class RewardParamsDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  isPopular: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (value) {
      return value.toLowerCase().split(',');
    }
    return [];
  })
  filter: string[];
}
