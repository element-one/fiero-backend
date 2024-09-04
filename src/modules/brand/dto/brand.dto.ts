import { IsString } from 'class-validator';

export class BrandDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  imageUrl: string;

  @IsString()
  tokenSymbol: string;
}
