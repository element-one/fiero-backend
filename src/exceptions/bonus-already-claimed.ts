import { BadRequestException } from '@nestjs/common';

export class BonusAlreadyClaimedException extends BadRequestException {
  constructor(error?: string) {
    super('error.bonus-already-claimed', error);
  }
}
