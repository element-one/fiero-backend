import { Injectable } from '@nestjs/common';

import { BadgeEntity } from '@entities/badge.entity';

import { BadgeRepository } from './badge.repository';

@Injectable()
export class BadgeService {
  constructor(private readonly badgeRepository: BadgeRepository) {}

  async getById(id: string): Promise<BadgeEntity> {
    return await this.badgeRepository.findById(id);
  }

  async getBySlugAndTokenId(
    slug: string,
    tokenId: number,
  ): Promise<BadgeEntity> {
    return await this.badgeRepository.findBySlugAndTokenId(slug, tokenId);
  }

  async getByTokenId(tokenId: number): Promise<BadgeEntity> {
    return await this.badgeRepository.findByTokenId(tokenId);
  }

  async getByContractAddress(
    contractAddress: string,
    tokenId: number,
  ): Promise<BadgeEntity> {
    return await this.badgeRepository.findByContractAddress(
      contractAddress,
      tokenId,
    );
  }
}
