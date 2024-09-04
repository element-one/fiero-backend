import { BadRequestException } from '@nestjs/common';

export class AlreadySentCodeException extends BadRequestException {
  constructor(error?: string) {
    super('error.already-sent-code', error);
  }
}
