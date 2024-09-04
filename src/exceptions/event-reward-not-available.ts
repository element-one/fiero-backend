import { BadRequestException } from '@nestjs/common';

export class EventRewardNotAvailableException extends BadRequestException {
  constructor(error?: string) {
    super('error.event-reward-not-available', error);
  }
}
