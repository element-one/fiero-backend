import { BadRequestException } from '@nestjs/common';

export class AlreadyInvitedException extends BadRequestException {
  constructor(error?: string) {
    super('error.already-invited', error);
  }
}
