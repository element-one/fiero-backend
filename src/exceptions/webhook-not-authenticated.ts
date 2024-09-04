import { BadRequestException } from '@nestjs/common';

export class WebhookNotAuthenticatedException extends BadRequestException {
  constructor(error?: string) {
    super('error.webhook-not-authenticated', error);
  }
}
