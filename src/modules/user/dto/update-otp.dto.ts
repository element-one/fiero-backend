import { IsDate, IsString } from 'class-validator';

export class UpdateOtpDto {
  @IsString()
  otpCode: string;

  @IsDate()
  otpCodeExpiredAt: Date;
}
