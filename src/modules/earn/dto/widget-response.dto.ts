import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { EarnDto } from './earn.dto';

export class WidgetResponseDto {
  @ApiProperty()
  @IsArray()
  earns: EarnDto[];
}
