import { BadRequestException } from '@nestjs/common';

export class SocialNotLinkedException extends BadRequestException {
  constructor(error?: string) {
    super('error.social-not-linked', error);
  }
}
