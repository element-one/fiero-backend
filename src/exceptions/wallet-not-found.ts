import { BadRequestException } from '@nestjs/common';

export class WalletNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.wallet-not-found', error);
  }
}
