import { BadRequestException } from '@nestjs/common';

export class SocialFetchContentException extends BadRequestException {
  constructor(error?: string) {
    super('error.social-fetch-content-failed', error);
  }
}
