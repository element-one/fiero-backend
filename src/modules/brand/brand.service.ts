import { Injectable } from '@nestjs/common';

import { PageDto, PageMetaDto, PageOptionsDto } from '@dtos/page';
import { BrandEntity } from '@entities/brand.entity';

import { BrandDto } from './dto/brand.dto';
import { BrandRepository } from './brand.repository';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async getBrands(pageOptionsDto: PageOptionsDto): Promise<PageDto<BrandDto>> {
    const queryBuilder = this.brandRepository.createQueryBuilder('brand');

    queryBuilder
      .leftJoinAndSelect('brand.earns', 'earns')
      .where('brand.isHidden = :hidden', { hidden: false })
      .orderBy('brand.order', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getBrand(brandId: string): Promise<BrandDto> {
    const brand = await this.brandRepository.findById(brandId);
    return brand;
  }

  async getBrandBySlug(slug: string): Promise<BrandEntity> {
    const brand = await this.brandRepository.findBySlug(slug);
    return brand;
  }
}
