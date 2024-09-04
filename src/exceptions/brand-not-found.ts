import { BadRequestException } from '@nestjs/common';

export class BrandNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.brand-not-found', error);
  }
}
