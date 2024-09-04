import { BadRequestException } from '@nestjs/common';

export class ReferralAlreadyClaimedException extends BadRequestException {
  constructor(error?: string) {
    super('error.referral-already-claimed', error);
  }
}
