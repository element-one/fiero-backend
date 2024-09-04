import { BadRequestException } from '@nestjs/common';

export class RewardAlreadyRedeemedException extends BadRequestException {
  constructor(error?: string) {
    super('error.reward-already-redeemed', error);
  }
}
