import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckReceiptDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  receiptUrl: string;
}
