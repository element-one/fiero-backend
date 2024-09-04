import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { UserReceiptEntity } from '@entities/user-receipt.entity';

export class CreateUserReceiptResponseDto {
  @ApiProperty()
  @IsString()
  userReceiptId: string;

  @ApiProperty()
  @IsString()
  earnId: string;

  constructor(userReceipt: UserReceiptEntity) {
    this.userReceiptId = userReceipt.id;
    this.earnId = userReceipt.earn.id;
  }
}
