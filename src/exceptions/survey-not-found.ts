import { BadRequestException } from '@nestjs/common';

export class SurveyNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.survey-not-found', error);
  }
}
