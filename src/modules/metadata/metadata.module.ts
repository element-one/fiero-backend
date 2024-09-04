import { Module } from '@nestjs/common';

import { BadgeModule } from '@modules/badge/badge.module';

import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';

@Module({
  imports: [BadgeModule],
  providers: [MetadataService],
  controllers: [MetadataController],
})
export class MetadataModule {}
