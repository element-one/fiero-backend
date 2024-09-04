import { BadRequestException } from '@nestjs/common';

export class SocialEmptyUsernameException extends BadRequestException {
  constructor(error?: string) {
    super('error.social-empty-username', error);
  }
}
