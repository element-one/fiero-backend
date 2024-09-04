import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { ReferralDto } from '@modules/user-referral/dto/referral.dto';

export class UserReferralsResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  referrals: ReferralDto[];
}
