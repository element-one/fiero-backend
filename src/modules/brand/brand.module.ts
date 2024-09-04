import { Module } from '@nestjs/common';

import { BrandController } from './brand.controller';
import { BrandRepository } from './brand.repository';
import { BrandService } from './brand.service';

@Module({
  providers: [BrandService, BrandRepository],
  controllers: [BrandController],
  exports: [BrandService],
})
export class BrandModule {}
