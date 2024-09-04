import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EarnSocialEntity } from '@entities/earn-social.entity';

@Injectable()
export class EarnSocialRepository extends Repository<EarnSocialEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EarnSocialEntity, dataSource.createEntityManager());
  }

  async findBySocialId(socialId: string): Promise<EarnSocialEntity> {
    const result = await this.findOne({ where: { id: socialId } });
    return result;
  }
}
