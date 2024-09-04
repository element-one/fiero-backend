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
import { ApiSuccessResponse } from '@dtos/api/api-success-response.dto';
import { PageDto } from '@dtos/page';
import { UserEntity } from '@entities/user.entity';
import JwtGuard from '@guards/jwt.guard';
import { UserEventRewardResponseDto } from '@modules/event-reward/dto/user-event-reward-response.dto';
import { AddEventCustomDto } from '@modules/event-reward-custom/dto/add-event-custom.dto';
import { EventRaffleParamsDto } from '@modules/event-reward-raffle/dto/event-raffle-params.dto';
import { EventUserDto } from '@modules/event-user/dto/event-user.dto';

import { EventDto } from './dto/event.dto';
import { EventParamsDto } from './dto/event-params.dto';
import { EventRaffleResponseDto } from './dto/event-raffle-response.dto';
import { EventsResponseDto } from './dto/events-response.dto';
import { EventService } from './event.service';

@Controller('events')
@ApiTags('Events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(EventDto)
  async getEvents(@Query() params: EventParamsDto): Promise<PageDto<EventDto>> {
    return this.eventService.getEvents(params);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getEvent(@Param('id') eventId: string): Promise<EventsResponseDto> {
    const event = await this.eventService.getEvent(eventId);
    return { event };
  }

  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async getBrandBySlug(
    @Param('slug') slug: string,
  ): Promise<EventsResponseDto> {
    const event = await this.eventService.getEventBySlug(slug);
    return { event };
  }

  @Put('/reward/:id/claim')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async putClaimEventReward(
    @User() user: UserEntity,
    @Param('id') rewardId: string,
  ): Promise<UserEventRewardResponseDto> {
    const userEventReward = await this.eventService.claimEventReward(
      user,
      rewardId,
    );
    return { userEventReward };
  }

  @Put('/reward/:qrcode/redeem')
  @HttpCode(HttpStatus.OK)
  async putRedeemEventReward(
    @Param('qrcode') qrCode: string,
  ): Promise<UserEventRewardResponseDto> {
    const result = await this.eventService.redeemEventReward(qrCode);
    return result;
  }

  @Post('/raffle/winner')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async postRaffleWinner(
    @User() user: UserEntity,
    @Body() body: EventRaffleParamsDto,
  ): Promise<EventRaffleResponseDto> {
    const eventRaffle = await this.eventService.getRaffleWinner(user, body);
    return { eventRaffle };
  }

  @Post('/raffle/round')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async postCreateRaffleRound(
    @User() user: UserEntity,
    @Body() body: EventRaffleParamsDto,
  ): Promise<EventsResponseDto> {
    const event = await this.eventService.createRaffleRound(user, body);
    return { event };
  }

  @Post('/reward/:id/custom')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async postAddEventCustom(
    @User() user: UserEntity,
    @Param('id') eventRewardId: string,
    @Body() body: AddEventCustomDto,
  ): Promise<UserEventRewardResponseDto> {
    const userEventReward = await this.eventService.addEventCustom(
      user.id,
      eventRewardId,
      body,
    );
    return { userEventReward };
  }

  @Post('/user')
  @HttpCode(HttpStatus.OK)
  async eventUser(@Body() body: EventUserDto): Promise<ApiSuccessResponse> {
    return await this.eventService.userEventReward(body);
  }
}
