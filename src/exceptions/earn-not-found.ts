import { BadRequestException } from '@nestjs/common';

export class EarnNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.earn-not-found', error);
  }
}
