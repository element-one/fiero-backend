import { BadRequestException } from '@nestjs/common';

export class EventRewardAlreadyCustomException extends BadRequestException {
  constructor(error?: string) {
    super('error.event-reward-already-custom', error);
  }
}
