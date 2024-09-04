import { BadRequestException } from '@nestjs/common';

export class EarnReceiptKeywordsNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.earn-receipt-keywords-not-found', error);
  }
}
