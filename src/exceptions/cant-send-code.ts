import { BadRequestException } from '@nestjs/common';

export class CantSendCodeException extends BadRequestException {
  constructor(error?: string) {
    super('error.can-not-send-code', error);
  }
}
