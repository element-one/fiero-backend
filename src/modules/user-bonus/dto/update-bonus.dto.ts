import { IsBoolean } from 'class-validator';

export class UpdateBonusDto {
  @IsBoolean()
  isAccepted: boolean;

  @IsBoolean()
  isClaimed: boolean;

  @IsBoolean()
  isAirdropped: boolean;

  @IsBoolean()
  isAirdropAttempted: boolean;
}
