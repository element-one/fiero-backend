import { BadRequestException } from '@nestjs/common';

export class RewardAlreadyClaimedException extends BadRequestException {
  constructor(error?: string) {
    super('error.reward-already-claimed', error);
  }
}
