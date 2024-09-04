import { BadRequestException } from '@nestjs/common';

export class EventRaffleNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.event-raffle-not-found', error);
  }
}
