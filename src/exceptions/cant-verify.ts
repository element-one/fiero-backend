import { BadRequestException } from '@nestjs/common';

export class CantVerifyException extends BadRequestException {
  constructor(error?: string) {
    super('error.can-not-verify', error);
  }
}
