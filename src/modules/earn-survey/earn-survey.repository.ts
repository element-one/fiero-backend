import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EarnSurveyEntity } from '@entities/earn-survey.entity';

@Injectable()
export class EarnSurveyRepository extends Repository<EarnSurveyEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EarnSurveyEntity, dataSource.createEntityManager());
  }
}
