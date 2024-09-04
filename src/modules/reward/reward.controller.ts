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
import { AddCustomDto } from '@modules/reward-custom/dto/add-custom.dto';
import { AddDeliveryDto } from '@modules/reward-delivery/dto/add-delivery.dto';
import { UserSpinResponseDto } from '@modules/reward-spin/dto/user-spin-response';

import { RewardDto } from './dto/reward.dto';
import { RewardParamsDto } from './dto/reward-params.dto';
import { UserRewardResponseDto } from './dto/user-reward-response.dto';
import { RewardService } from './reward.service';

@Controller('rewards')
@ApiTags('Rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(RewardDto)
  async getEarns(
    @Query() params: RewardParamsDto,
  ): Promise<PageDto<RewardDto>> {
    return this.rewardService.getRewards(params);
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getEarn(
    @User() user: UserEntity,
    @Param('id') rewardId: string,
  ): Promise<RewardDto> {
    return this.rewardService.getReward(user.id, rewardId);
  }

  @Put('/:id/claim')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async putClaimEarn(
    @User() user: UserEntity,
    @Param('id') rewardId: string,
  ): Promise<UserRewardResponseDto> {
    const userReward = await this.rewardService.claimReward(user, rewardId);
    return { userReward };
  }

  @Put('/:qrcode/redeem')
  @HttpCode(HttpStatus.OK)
  async putRedeemReward(
    @Param('qrcode') qrCode: string,
  ): Promise<UserRewardResponseDto> {
    const result = await this.rewardService.redeemReward(qrCode);
    return result;
  }

  @Post('/:id/delivery')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async postAddDelivery(
    @User() user: UserEntity,
    @Param('id') rewardId: string,
    @Body() body: AddDeliveryDto,
  ): Promise<UserRewardResponseDto> {
    const userReward = await this.rewardService.addDeliveryAddress(
      user.id,
      rewardId,
      body,
    );
    return { userReward };
  }

  @Post('/:id/custom')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async postAddCustom(
    @User() user: UserEntity,
    @Param('id') rewardId: string,
    @Body() body: AddCustomDto,
  ): Promise<UserRewardResponseDto> {
    const userReward = await this.rewardService.addCustom(
      user.id,
      rewardId,
      body,
    );
    return { userReward };
  }

  @Post('/:id/spin')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async postRewardSpin(
    @User() user: UserEntity,
    @Param('id') rewardId: string,
  ): Promise<UserSpinResponseDto> {
    return await this.rewardService.postRewardSpin(user, rewardId);
  }
}
