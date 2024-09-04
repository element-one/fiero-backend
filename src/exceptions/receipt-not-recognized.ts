import { BadRequestException } from '@nestjs/common';

export class ReceiptNotRecognizedException extends BadRequestException {
  constructor(error?: string) {
    super('error.receipt-not-recognized', error);
  }
}
