import { BadRequestException } from '@nestjs/common';

export class RewardNotAvailableException extends BadRequestException {
  constructor(error?: string) {
    super('error.reward-not-available', error);
  }
}
