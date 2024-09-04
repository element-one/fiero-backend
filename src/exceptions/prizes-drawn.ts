import { BadRequestException } from '@nestjs/common';

export class PrizesDrawnException extends BadRequestException {
  constructor(error?: string) {
    super('error.all-prizes-drawn', error);
  }
}
