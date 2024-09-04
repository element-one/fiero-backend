import { IsBoolean, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

import { LocationEnum } from '@type/enum';

export class EventDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  imageUrl: string;

  @IsDate()
  eventAt: Date;

  @IsString()
  slug: string;

  @IsEnum(LocationEnum)
  location: LocationEnum;

  @IsString()
  rsvp: string;

  @IsString()
  headerUrl: string;

  @IsBoolean()
  isPopular: boolean;

  @IsNumber()
  order: number;

  @IsString()
  brandId: string;
}
