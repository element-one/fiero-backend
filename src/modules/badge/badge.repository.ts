import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BadgeEntity } from '@entities/badge.entity';

@Injectable()
export class BadgeRepository extends Repository<BadgeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(BadgeEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<BadgeEntity> {
    const result = await this.findOne({ where: { id } });
    return result;
  }

  async findBySlugAndTokenId(
    slug: string,
    tokenId: number,
  ): Promise<BadgeEntity> {
    return await this.findOne({
      relations: ['brand'],
      where: {
        brand: {
          slug,
        },
        tokenId,
      },
    });
  }

  async findByTokenId(tokenId: number): Promise<BadgeEntity> {
    return await this.findOne({
      relations: ['brand'],
      where: {
        tokenId,
      },
    });
  }

  async findByContractAddress(
    contractAddress: string,
    tokenId: number,
  ): Promise<BadgeEntity> {
    return await this.findOne({
      where: { contractAddress, tokenId },
    });
  }
}
