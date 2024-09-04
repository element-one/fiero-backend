import { BadRequestException } from '@nestjs/common';

export class EventRewardAlreadyRedeemedException extends BadRequestException {
  constructor(error?: string) {
    super('error.event-reward-already-redeemed', error);
  }
}
