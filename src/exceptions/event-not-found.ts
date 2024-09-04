import { BadRequestException } from '@nestjs/common';

export class EventNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.event-not-found', error);
  }
}
