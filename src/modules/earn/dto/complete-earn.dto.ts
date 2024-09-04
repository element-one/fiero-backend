import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

import { JSONObject } from '@type/common';

export class CompleteEarnDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => JSON.parse(value))
  answers: JSONObject;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  // instagram id
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id: string;

  // instagram caption
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  caption: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userReceiptId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postUrl: string;
}
