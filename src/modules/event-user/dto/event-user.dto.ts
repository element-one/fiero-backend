import { IsString } from 'class-validator';

export class EventUserDto {
  @IsString()
  email: string;

  @IsString()
  dob: string;

  @IsString()
  phone: string;

  @IsString()
  name: string;
}
