import { BadRequestException } from '@nestjs/common';

export class RewardAlreadyCustomException extends BadRequestException {
  constructor(error?: string) {
    super('error.reward-already-custom', error);
  }
}
