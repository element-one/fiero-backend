import { BadRequestException } from '@nestjs/common';

export class RewardNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.reward-not-found', error);
  }
}
