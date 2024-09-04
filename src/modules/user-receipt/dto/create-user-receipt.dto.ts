import { IsString } from 'class-validator';

import { EarnEntity } from '@entities/earn.entity';

export class CreateUserReceiptDto {
  @IsString()
  receiptUrl: string;

  earn: EarnEntity;
}
