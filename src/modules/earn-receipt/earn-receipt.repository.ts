import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EarnReceiptEntity } from '@entities/earn-receipt.entity';

@Injectable()
export class EarnReceiptRepository extends Repository<EarnReceiptEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EarnReceiptEntity, dataSource.createEntityManager());
  }
}
