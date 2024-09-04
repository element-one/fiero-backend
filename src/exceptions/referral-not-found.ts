import { BadRequestException } from '@nestjs/common';

export class ReferralNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.referral-not-found', error);
  }
}
