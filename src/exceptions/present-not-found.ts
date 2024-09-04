import { BadRequestException } from '@nestjs/common';

export class PresentNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.present-not-found', error);
  }
}
