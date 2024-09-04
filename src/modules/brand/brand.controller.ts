import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '@decorators/api-paginated-response.decorator';
import { PageDto, PageOptionsDto } from '@dtos/page';

import { BrandDto } from './dto/brand.dto';
import { BrandResponseDto } from './dto/brand-response.dto';
import { BrandService } from './brand.service';

@Controller('brands')
@ApiTags('Brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(BrandDto)
  async getBrands(@Query() params: PageOptionsDto): Promise<PageDto<BrandDto>> {
    return this.brandService.getBrands(params);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getBrand(@Param('id') brandId: string): Promise<BrandResponseDto> {
    const brand = await this.brandService.getBrand(brandId);
    return { brand };
  }

  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async getBrandBySlug(@Param('slug') slug: string): Promise<BrandResponseDto> {
    const brand = await this.brandService.getBrandBySlug(slug);
    return { brand };
  }
}
