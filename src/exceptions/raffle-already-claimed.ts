import { BadRequestException } from '@nestjs/common';

export class RaffleAlreadyClaimedException extends BadRequestException {
  constructor(error?: string) {
    super('error.raffle-already-claimed', error);
  }
}
