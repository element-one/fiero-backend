import { BadRequestException } from '@nestjs/common';

export class NotAirdropException extends BadRequestException {
  constructor(error?: string) {
    super('error.not-airdrop', error);
  }
}
