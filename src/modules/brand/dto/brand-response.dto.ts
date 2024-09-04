import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { BrandDto } from './brand.dto';

export class BrandResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  brand: BrandDto;
}
