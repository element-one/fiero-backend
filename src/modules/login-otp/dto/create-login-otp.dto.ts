import { IsDate, IsOptional, IsString } from 'class-validator';

import { UserEntity } from '@entities/user.entity';

export class CreateLoginOtpDto {
  @IsOptional()
  @IsString()
  otpCode?: string;

  @IsOptional()
  @IsDate()
  otpCodeSendAt: Date;

  @IsOptional()
  @IsDate()
  otpCodeExpiredAt: Date;

  user: UserEntity;
}
