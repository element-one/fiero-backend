import { BadRequestException } from '@nestjs/common';

export class InvalidEmailException extends BadRequestException {
  constructor(error?: string) {
    super('error.invalid-email', error);
  }
}
