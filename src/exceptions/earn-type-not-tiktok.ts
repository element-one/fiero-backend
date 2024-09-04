import { BadRequestException } from '@nestjs/common';

export class EarnTypeNotTiktokFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.earn-type-not-tiktok', error);
  }
}
