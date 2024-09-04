import { BadRequestException } from '@nestjs/common';

export class UserEventRewardNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.user-event-reward-not-found', error);
  }
}
