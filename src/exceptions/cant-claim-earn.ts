import { BadRequestException } from '@nestjs/common';

export class CantClaimEarnException extends BadRequestException {
  constructor(error?: string) {
    super('error.can-not-claim-earn', error);
  }
}
