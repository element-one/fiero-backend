import { BadRequestException } from '@nestjs/common';

export class RewardNotRedeemedException extends BadRequestException {
  constructor(error?: string) {
    super('error.reward-not-redeemed', error);
  }
}
