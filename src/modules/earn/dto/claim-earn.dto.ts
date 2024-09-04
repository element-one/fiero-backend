import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ClaimEarnDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referralId?: string;
}
