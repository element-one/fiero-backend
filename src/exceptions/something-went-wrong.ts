import { InternalServerErrorException } from '@nestjs/common';

export class SomethingWentWrongException extends InternalServerErrorException {
  constructor(error?: string) {
    super('error.something-went-wrong', error);
  }
}
