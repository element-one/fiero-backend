import { BadRequestException } from '@nestjs/common';

export class RewardNotEnoughTokenException extends BadRequestException {
  constructor(error?: string) {
    super('error.reward-not-enough-token', error);
  }
}
