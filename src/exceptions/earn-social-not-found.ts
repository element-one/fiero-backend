import { BadRequestException } from '@nestjs/common';

export class EarnSocialNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.earn-social-not-found', error);
  }
}
