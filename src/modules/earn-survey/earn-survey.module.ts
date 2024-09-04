import { Module } from '@nestjs/common';

import { EarnSurveyService } from './earn-survey.service';

@Module({
  providers: [EarnSurveyService],
  controllers: [],
})
export class EarnSurveyModule {}
