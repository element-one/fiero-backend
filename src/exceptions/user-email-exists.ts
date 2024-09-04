import { BadRequestException } from '@nestjs/common';

export class UserEmailExistsException extends BadRequestException {
  constructor(error?: string) {
    super('error.user-email-exists', error);
  }
}
