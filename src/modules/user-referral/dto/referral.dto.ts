import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

import { UserReferralEntity } from '@entities/user-referral.entity';
import { UserDto } from '@modules/user/dto/user.dto';

export class ReferralDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsObject()
  referral: UserDto;

  @ApiProperty()
  @IsObject()
  referrer: UserDto;

  constructor(referral: UserReferralEntity) {
    this.id = referral.id;
    this.email = referral.email;
    this.referral = referral.referral && new UserDto(referral.referral);
    this.referrer = referral.referrer && new UserDto(referral.referrer);
  }
}
