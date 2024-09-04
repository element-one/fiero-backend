import { BadRequestException } from '@nestjs/common';

export class SocialNotAccessibleException extends BadRequestException {
  constructor(error?: string) {
    super('error.social-not-accessible', error);
  }
}
