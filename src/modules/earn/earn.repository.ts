import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EarnEntity } from '@entities/earn.entity';

import { EarnParamsDto } from './dto/earn-params.dto';

@Injectable()
export class EarnRepository extends Repository<EarnEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EarnEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<EarnEntity> {
    const earn = await this.findOne({
      where: { id },
      relations: ['badge', 'brand'],
    });
    return earn;
  }

  async findByParams(pageOptionsDto: EarnParamsDto): Promise<any> {
    const queryBuilder = this.createQueryBuilder('earn');

    queryBuilder
      .leftJoinAndSelect('earn.brand', 'brand')
      .leftJoinAndSelect('earn.earnSocial', 'social')
      .leftJoinAndSelect('earn.earnSurveys', 'surveys')
      .leftJoinAndSelect('earn.earnReadings', 'readings')
      .leftJoinAndSelect('earn.badge', 'badge')
      .orderBy('earn.createdAt', pageOptionsDto.order)
      .where('earn.isHidden = :isHidden', { isHidden: false })
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (pageOptionsDto.isPopular) {
      queryBuilder.andWhere('earn.isPopular = :isPopular', { isPopular: true });
    }

    if (pageOptionsDto.slug) {
      queryBuilder.andWhere('earn.brand.slug = :slug', {
        slug: pageOptionsDto.slug,
      });
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    return { entities, itemCount };
  }
}
