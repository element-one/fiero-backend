import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  error?: string;
}
