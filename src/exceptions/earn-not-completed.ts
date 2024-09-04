import { BadRequestException } from '@nestjs/common';

export class EarnNotCompletedException extends BadRequestException {
  constructor(error?: string) {
    super('error.earn-not-completed', error);
  }
}
