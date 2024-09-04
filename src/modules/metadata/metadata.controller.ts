import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MetadataService } from './metadata.service';

@Controller('metadata')
@ApiTags('Metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get('/badge/:id')
  @HttpCode(HttpStatus.OK)
  async getBadgeMetadata(@Param('id') tokenId: string) {
    const id = Number(tokenId.replace('.json', ''));
    return await this.metadataService.getBadgeMetadata(id);
  }

  @Get('/brand/:id')
  @HttpCode(HttpStatus.OK)
  async getBrandMetadata(
    @Param('slug') slug: string,
    @Param('id') tokenId: string,
  ) {
    const id = Number(tokenId.replace('.json', ''));
    return await this.metadataService.getBrandMetadata(id);
  }
}
