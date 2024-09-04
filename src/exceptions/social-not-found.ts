import { BadRequestException } from '@nestjs/common';

export class SocialNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.social-not-found', error);
  }
}
