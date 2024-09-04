import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddCustomDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;
}
