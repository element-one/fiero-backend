import { BadRequestException } from '@nestjs/common';

export class EmailNotVerifiedException extends BadRequestException {
  constructor(error?: string) {
    super('error.email-not-verified', error);
  }
}
