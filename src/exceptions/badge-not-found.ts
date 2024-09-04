import { BadRequestException } from '@nestjs/common';

export class BadgeNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.badge-not-found', error);
  }
}
