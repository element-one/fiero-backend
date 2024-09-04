import { BadRequestException } from '@nestjs/common';

export class DidNotWinException extends BadRequestException {
  constructor(error?: string) {
    super('error.did-not-win', error);
  }
}
