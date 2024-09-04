import { BadRequestException } from '@nestjs/common';

export class SocialAlreadyLinkedException extends BadRequestException {
  constructor(error?: string) {
    super('error.social-already-linked', error);
  }
}
