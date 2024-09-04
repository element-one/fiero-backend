import { BadRequestException } from '@nestjs/common';

export class UserRewardNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.user-reward-not-found', error);
  }
}
