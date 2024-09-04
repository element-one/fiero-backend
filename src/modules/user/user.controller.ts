import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { User } from '@decorators/user.decorator';
import { ApiSuccessResponse } from '@dtos/api/api-success-response.dto';
import { UserEntity } from '@entities/user.entity';
import JwtGuard from '@guards/jwt.guard';
import { UserResponseDto } from '@modules/auth/dto/user-response.dto';
import { UserEarnsResponseDto } from '@modules/user/dto/user-earn-response.dto';
import { UserEventRewardResponseDto } from '@modules/user/dto/user-event-reward-response.dto';
import { UserRewardResponseDto } from '@modules/user/dto/user-reward-response.dto';

import { InstagramPostResponseDto } from './dto/instagram-post-response.dto';
import { InstagramProfileResponseDto } from './dto/instagram-profile-response.dto';
import { InviteFriendDto } from './dto/invite-friend.dto';
import { LinkInstagramDto } from './dto/link-instagram.dto';
import { LinkTiktokDto } from './dto/link-tiktok.dto';
import { TikTokPostResponseDto } from './dto/tiktok-post-response.dto';
import { TikTokProfileResponseDto } from './dto/tiktok-profile-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserBadgesResponseDto } from './dto/user-badge-response.dto';
import { UserHoldingsResponseDto } from './dto/user-holding-response.dto';
import { UserReferralsResponseDto } from './dto/user-referral-response.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@User() user: UserEntity): Promise<UserResponseDto> {
    const foundUser = await this.userService.getById(user.id);
    return { user: foundUser };
  }

  @Get('/earns')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getEarns(@User() user: UserEntity): Promise<UserEarnsResponseDto> {
    const foundUser = await this.userService.getEarnsById(user.id);
    return { earns: foundUser.earns };
  }

  @Get('/holdings')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getHoldings(
    @User() user: UserEntity,
  ): Promise<UserHoldingsResponseDto> {
    const foundUser = await this.userService.getHoldingsById(user.id);
    return { holdings: foundUser.holdings };
  }

  @Get('/badges')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getBadges(@User() user: UserEntity): Promise<UserBadgesResponseDto> {
    const foundUser = await this.userService.getBadgesById(user.id);
    return { badges: foundUser.badges };
  }

  @Get('/rewards')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getRewards(@User() user: UserEntity): Promise<UserRewardResponseDto> {
    const foundUser = await this.userService.getRewardsById(user.id);
    return { rewards: foundUser.rewards };
  }

  @Get('/event/rewards')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getEventRewards(
    @User() user: UserEntity,
  ): Promise<UserEventRewardResponseDto> {
    const foundUser = await this.userService.getEventRewardsById(user.id);
    return { eventRewards: foundUser.eventRewards };
  }

  @Get('/referrals')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getReferrals(
    @User() user: UserEntity,
  ): Promise<UserReferralsResponseDto> {
    const referrals = await this.userService.getReferralsById(user.id);
    return { referrals };
  }

  @Get('/avatar/url')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getAvatarPresignedUrl(@User() user: UserEntity): Promise<string> {
    return await this.userService.getAvatarPresignedUrl(user.id);
  }

  @Put('/me')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async updateMe(
    @User() user: UserEntity,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const foundUser = await this.userService.updateById(user.id, body);
    return { user: foundUser };
  }

  @Get('/instagram/profile')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getInstagramProfile(
    @User() user: UserEntity,
  ): Promise<InstagramProfileResponseDto> {
    const profile = await this.userService.getInstagramProfile(user);
    return { profile };
  }

  @Get('/instagram/posts')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getInstagramPosts(
    @User() user: UserEntity,
  ): Promise<InstagramPostResponseDto> {
    const posts = await this.userService.getInstagramPosts(user);
    return { posts };
  }

  @Put('/instagram')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async linkInstagram(
    @User() user: UserEntity,
    @Body() body: LinkInstagramDto,
  ): Promise<UserResponseDto> {
    const foundUser = await this.userService.linkInstagram(user, body.username);
    return { user: foundUser };
  }

  @Get('/tiktok/profile')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getTikTokProfile(
    @User() user: UserEntity,
  ): Promise<TikTokProfileResponseDto> {
    const profile = await this.userService.getTikTokProfile(user);
    return { profile };
  }

  @Get('/tiktok/posts')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getTiktokPosts(
    @User() user: UserEntity,
  ): Promise<TikTokPostResponseDto> {
    const posts = await this.userService.getTikTokPosts(user);
    return { posts };
  }

  @Put('/tiktok')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async linkTiktok(
    @User() user: UserEntity,
    @Body() body: LinkTiktokDto,
  ): Promise<UserResponseDto> {
    const foundUser = await this.userService.linkTiktok(user, body.username);
    return { user: foundUser };
  }

  @Post('/invite')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async inviteUser(
    @User() user: UserEntity,
    @Body() body: InviteFriendDto,
  ): Promise<UserResponseDto> {
    const foundUser = await this.userService.inviteUser(user, body.email);
    return { user: foundUser };
  }

  @Put('/referral/:id/claim')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async claimReferral(
    @User() user: UserEntity,
    @Param('id') referralId: string,
  ): Promise<UserResponseDto> {
    const foundedUser = await this.userService.claimReferral(user, referralId);
    return { user: foundedUser };
  }

  @Put('/bonus/:id/claim')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async claimBonus(
    @User() user: UserEntity,
    @Param('id') bonusId: string,
  ): Promise<UserResponseDto> {
    const foundedUser = await this.userService.claimBonus(user, bonusId);
    return { user: foundedUser };
  }

  @Delete('/social/:socialId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async removeSocial(
    @User() user: UserEntity,
    @Param('socialId') socialId: string,
  ): Promise<ApiSuccessResponse> {
    await this.userService.removeSocial(user, socialId);
    return new ApiSuccessResponse();
  }

  @Post('/following')
  @HttpCode(HttpStatus.OK)
  async getFollowing(@Body() body: any): Promise<any> {
    const foundUser = await this.userService.getFollowing(body);
    return foundUser;
  }
}
