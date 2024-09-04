import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class LinkTiktokDto {
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  username?: string;
}
