import { BadRequestException } from '@nestjs/common';

export class UserResidenceRestrictedException extends BadRequestException {
  constructor(error?: string) {
    super('error.user-residence-restricted', error);
  }
}
