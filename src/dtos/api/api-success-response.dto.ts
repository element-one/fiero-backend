import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ApiSuccessResponse {
  @ApiProperty()
  @IsString()
  message = 'success';
}
