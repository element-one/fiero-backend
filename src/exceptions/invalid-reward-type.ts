import { BadRequestException } from '@nestjs/common';

export class InvaildRewardTypeException extends BadRequestException {
  constructor(error?: string) {
    super('error.invalid-reward-type', error);
  }
}
