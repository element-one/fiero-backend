import { BadRequestException } from '@nestjs/common';

export class OpenaiSomethingException extends BadRequestException {
  constructor(error?: string) {
    super('error.openai-something-wrong', error);
  }
}
