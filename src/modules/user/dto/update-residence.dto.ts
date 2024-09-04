import { IsString } from 'class-validator';

export class UpdateResidenceDto {
  @IsString()
  country: string;

  @IsString()
  state: string;
}
