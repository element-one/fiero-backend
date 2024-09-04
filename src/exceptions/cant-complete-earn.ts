import { BadRequestException } from '@nestjs/common';

export class CantCompleteEarnException extends BadRequestException {
  constructor(error?: string) {
    super('error.can-not-complete-earn', error);
  }
}
