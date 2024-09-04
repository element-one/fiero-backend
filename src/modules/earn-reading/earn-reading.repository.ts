import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EarnReadingEntity } from '@entities/earn-reading.entity';

@Injectable()
export class EarnReadingRepository extends Repository<EarnReadingEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EarnReadingEntity, dataSource.createEntityManager());
  }
}
