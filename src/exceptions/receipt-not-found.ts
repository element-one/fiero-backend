import { BadRequestException } from '@nestjs/common';

export class ReceiptNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.receipt-not-found', error);
  }
}
