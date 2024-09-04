import { BadRequestException } from '@nestjs/common';

export class InvalidCodeException extends BadRequestException {
  constructor(error?: string) {
    super('error.invalid-code-or-expired', error);
  }
}
