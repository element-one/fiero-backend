import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BrandEntity } from '@entities/brand.entity';
import { BrandNotFoundException } from '@exceptions/brand-not-found';

@Injectable()
export class BrandRepository extends Repository<BrandEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(BrandEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<BrandEntity> {
    const brand = await this.findOne({
      where: { id },
      relations: ['earns', 'rewards'],
    });
    return brand;
  }

  async findBySlug(slug: string): Promise<BrandEntity> {
    const brand = await this.findOne({
      relations: ['earns', 'rewards'],
      where: { slug },
      order: {
        earns: {
          order: 'ASC',
          earnSurveys: {
            order: 'ASC',
          },
        },
      },
    });

    if (!brand) {
      throw new BrandNotFoundException();
    }

    brand.earns = brand?.earns.filter((earn) => earn.isHidden === false);
    return brand;
  }
}
