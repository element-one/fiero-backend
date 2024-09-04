import { Injectable } from '@nestjs/common';

import { BadgeService } from '@modules/badge/badge.service';

@Injectable()
export class MetadataService {
  constructor(private readonly badgeService: BadgeService) {}

  async getBadgeMetadata(tokenId: number) {
    const badge = await this.badgeService.getByTokenId(tokenId);
    return badge?.metadata;
  }

  async getBrandMetadata(tokenId: number) {
    console.log(tokenId);
    return {
      name: 'Lobos 1707 Token',
      image: 'https://glass-app-prod.s3.us-east-2.amazonaws.com/badge/20.png',
      attributes: [
        { value: 'Lobos 1707', trait_type: 'Brand' },
        { value: 'Lobos 1707 Token', trait_type: 'Token' },
      ],
    };
  }
}
