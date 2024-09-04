import { BadRequestException } from '@nestjs/common';

export class CantSendEmailException extends BadRequestException {
  constructor(error?: string) {
    super('error.can-not-send-email', error);
  }
}
