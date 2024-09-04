import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { EarnEntity } from '@entities/earn.entity';

export class EarnDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  imageUrl: string;

  constructor(earn: EarnEntity) {
    this.id = earn.id;
    this.name = earn.name;
    this.description = earn.description;
    this.imageUrl = earn.imageUrl;
  }
}
