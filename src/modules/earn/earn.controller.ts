import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '@decorators/api-paginated-response.decorator';
import { User } from '@decorators/user.decorator';
import { PageDto } from '@dtos/page';
import { UserEntity } from '@entities/user.entity';
import JwtGuard from '@guards/jwt.guard';
import { CreateUserReceiptResponseDto } from '@modules/user-receipt/dto/create-user-receipt-response.dto';

import { CheckReceiptDto } from './dto/check-receipt.dto';
import { CompleteEarnDto } from './dto/complete-earn.dto';
import { EarnDto } from './dto/earn.dto';
import { EarnParamsDto } from './dto/earn-params.dto';
import { UserEarnResponseDto } from './dto/user-earn-response.dto';
import { WidgetParamsDto } from './dto/widget-params.dto';
import { WidgetResponseDto } from './dto/widget-response.dto';
import { EarnService } from './earn.service';

@Controller('earns')
@ApiTags('Earns')
export class EarnController {
  constructor(private readonly earnService: EarnService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(EarnDto)
  async getEarns(@Query() params: EarnParamsDto): Promise<PageDto<EarnDto>> {
    return this.earnService.getEarns(params);
  }

  @Get('/widget')
  @HttpCode(HttpStatus.OK)
  async getWidgetEarn(
    @Query() params: WidgetParamsDto,
  ): Promise<WidgetResponseDto> {
    return await this.earnService.getWidgetEarn(params);
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getEarn(
    @User() user: UserEntity,
    @Param('id') earnId: string,
  ): Promise<EarnDto> {
    return this.earnService.getEarn(user.id, earnId);
  }

  @Put('/:id/complete')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async putCompleteEarn(
    @User() user: UserEntity,
    @Param('id') earnId: string,
    @Body() body: CompleteEarnDto,
  ): Promise<UserEarnResponseDto> {
    const userEarn = await this.earnService.completeEarn(user.id, earnId, body);
    return { userEarn };
  }

  @Put('/:id/claim')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async putClaimEarn(
    @User() user: UserEntity,
    @Param('id') earnId: string,
  ): Promise<UserEarnResponseDto> {
    const userEarn = await this.earnService.claimEarn(user.id, earnId);
    return { userEarn };
  }

  @Get('/receipt/url')
  @HttpCode(HttpStatus.OK)
  async getReciptPresignedUrl(): Promise<string> {
    return await this.earnService.getReceiptPresignedUrl();
  }

  @Post('/check/receipt')
  @HttpCode(HttpStatus.OK)
  async checkReceipt(
    @Body() body: CheckReceiptDto,
  ): Promise<CreateUserReceiptResponseDto> {
    return await this.earnService.checkReceipt(body);
  }
}
