import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class LinkInstagramDto {
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  username?: string;
}
