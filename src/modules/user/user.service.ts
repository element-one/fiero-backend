import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import * as generator from 'generate-password';

import { BONUS_POINTS, REFERRAL_POINTS } from '@config/constant';
import { UserEntity } from '@entities/user.entity';
import { AlreadyInvitedException } from '@exceptions/already-invited';
import { BonusAlreadyClaimedException } from '@exceptions/bonus-already-claimed';
import { InvalidEmailException } from '@exceptions/invalid-email';
import { ReferralAlreadyClaimedException } from '@exceptions/referral-already-claimed';
import { SocialAlreadyLinkedException } from '@exceptions/social-already-linked';
import { SocialNotAccessibleException } from '@exceptions/social-not-accessible';
import { SomethingWentWrongException } from '@exceptions/something-went-wrong';
import { UserEmailExistsException } from '@exceptions/user-email-exists';
import { CreateSocialUserDto } from '@modules/auth/dto/create-social-user.dto';
import { LoginUserDto } from '@modules/auth/dto/login-user.dto';
import { BrandService } from '@modules/brand/brand.service';
import { RewardService } from '@modules/reward/reward.service';
import { UserBonusService } from '@modules/user-bonus/user-bonus.service';
import { UserHoldingService } from '@modules/user-holding/user-holding.service';
import { ReferralDto } from '@modules/user-referral/dto/referral.dto';
import { UserReferralService } from '@modules/user-referral/user-referral.service';
import { UserRewardService } from '@modules/user-reward/user-reward.service';
import { UserSocialService } from '@modules/user-social/user-social.service';
import { S3Service } from '@services/aws/s3.service';
import { SesService } from '@services/aws/ses.service';
import { isValidEmail } from '@utils/common';
import { getInstagramUser, getTikTokUser } from '@utils/social';

import { InstagramPostDto } from './dto/instagram-post.dto';
import { InstagramProfileDto } from './dto/instagram-profile.dto';
import { TikTokPostDto } from './dto/tiktok-post.dto';
import { TikTokProfileDto } from './dto/tiktok-profile.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { UpdateResidenceDto } from './dto/update-residence.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PostgresErrorCode } from './enum/error.enum';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly brandService: BrandService,
    private readonly userReferralService: UserReferralService,
    private readonly userSocialService: UserSocialService,
    private readonly userBonusService: UserBonusService,
    private readonly userHoldingService: UserHoldingService,
    private readonly userRewardService: UserRewardService,
    private readonly rewardService: RewardService,
    private readonly s3Service: S3Service,
    private readonly sesService: SesService,
    private readonly httpService: HttpService,
  ) {}

  async createUser(dto: LoginUserDto): Promise<UserEntity> {
    try {
      let user = await this.userRepository.createUser({
        email: dto.email,
        brand: dto.brand,
      });

      const referralCode = generator.generate({
        length: 10,
        lowercase: true,
        uppercase: false,
        numbers: true,
      });
      user.referralCode = referralCode;
      user = await this.userRepository.save(user);

      await this.updateReferral(user, dto.referralCode);

      return user;
    } catch (err) {
      if (err?.code === PostgresErrorCode.UniqueViolation) {
        throw new UserEmailExistsException();
      }
      throw new SomethingWentWrongException();
    }
  }

  async createSocialUser(dto: CreateSocialUserDto): Promise<UserEntity> {
    try {
      let user = await this.userRepository.createUser(dto);

      const referralCode = generator.generate({
        length: 10,
        lowercase: true,
        uppercase: false,
        numbers: true,
      });
      user.referralCode = referralCode;

      user = await this.userRepository.save(user);

      await this.updateReferral(user);

      return user;
    } catch (err) {
      console.log(err);
      if (err?.code === PostgresErrorCode.UniqueViolation) {
        throw new UserEmailExistsException();
      }
      throw new SomethingWentWrongException();
    }
  }

  async updateReferral(user: UserEntity, referralCode?: string) {
    if (!referralCode) return;

    const referrer = await this.userRepository.findByReferralCode(referralCode);
    if (!referrer) return;

    await this.sesService.sendEmailToReferee(referrer.email);

    let referral = await this.userReferralService.getByEmailAndReferrerId(
      user.email,
      referrer.id,
    );
    if (!referral) {
      referral = await this.userReferralService.createReferral({
        points: REFERRAL_POINTS,
        email: user.email,
        referrer,
        referral: user,
      });
    }

    if (referral.isAccepted) return;

    referral.points = REFERRAL_POINTS;
    referral.referral = user;
    referral.isAccepted = true;
    referral.isCompleted = true;
    await this.userReferralService.saveReferral(referral);

    // add user bonus
    await this.userBonusService.createBonus({
      points: BONUS_POINTS,
      user,
      isCompleted: true,
    });
  }

  async getByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findByEmail(email);
  }

  async getById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findById(userId);
  }

  async getEarnsById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findEarnsById(userId);
  }

  async getHoldingsById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findHoldingsById(userId);
  }

  async getBadgesById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findBadgesById(userId);
  }

  async getRewardsById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findRewardsById(userId);
  }

  async getEventRewardsById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findEventRewardsById(userId);
  }

  async getReferralsById(userId: string): Promise<ReferralDto[]> {
    return await this.userReferralService.getByReferrerId(userId);
  }

  async getAvatarPresignedUrl(userId: string): Promise<any> {
    const urls = await this.s3Service.getSignedUrl(
      userId,
      'image/png',
      'avatar',
    );
    return urls;
  }

  async updateById(userId: string, dto: UpdateUserDto): Promise<UserEntity> {
    return await this.userRepository.updateUser(userId, dto);
  }

  async updateResidence(
    user: UserEntity,
    dto: UpdateResidenceDto,
  ): Promise<UserEntity> {
    user.country = dto.country;
    user.state = dto.state;
    return await this.userRepository.save(user);
  }

  async updateOtpCode(userId: string, dto: UpdateOtpDto): Promise<UserEntity> {
    return await this.userRepository.updateOtp(userId, dto);
  }

  async activateUser(user: UserEntity): Promise<UserEntity> {
    user.isEmailVerified = true;
    return await this.userRepository.save(user);
  }

  async updateFirstLogin(user: UserEntity): Promise<UserEntity> {
    user.isFirst = false;
    return await this.userRepository.save(user);
  }

  async getInstagramProfile(user: UserEntity): Promise<InstagramProfileDto> {
    const instagram = await getInstagramUser(user);

    if (!instagram.token) {
      throw new SocialNotAccessibleException();
    }

    console.log(instagram.socialId);

    try {
      const url = `https://graph.instagram.com/v18.0/me?fields=username,media_count,followers_count,profile_picture_url&access_token=${instagram.token}`;
      const result = await this.httpService.axiosRef.get(url);

      console.log(result.data);

      return plainToClass(InstagramProfileDto, result.data);
    } catch (err) {
      console.log(err);
      throw new SocialNotAccessibleException();
    }
  }

  async getInstagramPosts(user: UserEntity): Promise<InstagramPostDto[]> {
    const instagram = await getInstagramUser(user);

    if (!instagram.token) {
      throw new SocialNotAccessibleException();
    }

    try {
      const url = `https://graph.instagram.com/me/media?fields=media_url,thumbnail_url,caption&access_token=${instagram.token}`;
      const result = await this.httpService.axiosRef.get(url);

      return result.data.data.map((post) => {
        return plainToClass(InstagramPostDto, post);
      });
    } catch (err) {
      console.log(err);
      throw new SocialNotAccessibleException();
    }
  }

  async linkInstagram(user: UserEntity, username: string): Promise<UserEntity> {
    let social = await this.userSocialService.getByUsernameAndType(
      username,
      'instagram',
    );

    console.log(social);

    if (social) {
      throw new SocialAlreadyLinkedException();
    }

    social = await this.userSocialService.createSocial({
      username,
      type: 'instagram',
      code: '',
    });
    social.user = user;
    social.isVerified = true;
    await this.userSocialService.saveSocial(social);

    return await this.userRepository.findById(user.id);
  }

  async getTikTokProfile(user: UserEntity): Promise<TikTokProfileDto> {
    const tikTok = await getTikTokUser(user);

    if (!tikTok.token) {
      throw new SocialNotAccessibleException();
    }

    console.log(tikTok.socialId);

    try {
      const url =
        'https://open.tiktokapis.com/v2/user/info/?fields=avatar_url,video_count,follower_count,following_count';
      const result = await this.httpService.axiosRef.get(url, {
        headers: {
          Authorization: `Bearer ${tikTok.token}`,
        },
      });

      console.log(result.data);

      return plainToClass(TikTokProfileDto, result.data?.data?.user || {});
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        throw new SocialNotAccessibleException();
      }
    }
  }

  async getTikTokPosts(user: UserEntity): Promise<TikTokPostDto[]> {
    const tikTok = await getTikTokUser(user);

    if (!tikTok.token) {
      throw new SocialNotAccessibleException();
    }

    try {
      const url =
        'https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link';
      const result = await this.httpService.axiosRef.post(
        url,
        {
          max_count: 20,
        },
        {
          headers: {
            Authorization: `Bearer ${tikTok.token}`,
          },
        },
      );

      return result.data.data.videos.map((post) => {
        return plainToClass(TikTokPostDto, post);
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        throw new SocialNotAccessibleException();
      }
    }
  }

  async linkTiktok(user: UserEntity, username: string): Promise<UserEntity> {
    let social = await this.userSocialService.getByUsernameAndType(
      username,
      'tiktok',
    );

    console.log(social);

    if (social) {
      throw new SocialAlreadyLinkedException();
    }

    social = await this.userSocialService.createSocial({
      username,
      type: 'tiktok',
      code: '',
    });
    social.user = user;
    social.isVerified = true;
    await this.userSocialService.saveSocial(social);

    return await this.userRepository.findById(user.id);
  }

  async removeSocial(user: UserEntity, socialId: string): Promise<void> {
    const social = await this.userSocialService.getById(socialId);
    if (user.id !== social.user.id) {
      throw new UnauthorizedException();
    }

    await this.userSocialService.removeSocial(social.id);
  }

  async inviteUser(user: UserEntity, email: string): Promise<UserEntity> {
    if (this.configService.get('APP_ENV') !== 'dev') {
      if (!isValidEmail(email)) {
        throw new InvalidEmailException();
      }
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AlreadyInvitedException();
    }

    const referral = await this.userReferralService.getByEmailAndReferrerId(
      email,
      user.id,
    );
    if (referral) {
      throw new AlreadyInvitedException();
    }

    await this.userReferralService.createReferral({
      email,
      referrer: user,
      points: REFERRAL_POINTS,
    });

    // only trigger
    this.sesService.sendReferralEmail(email);

    return await this.userRepository.findById(user.id);
  }

  async claimReferral(
    user: UserEntity,
    referralId: string,
  ): Promise<UserEntity> {
    const referral = await this.userReferralService.getById(referralId);
    if (referral.referrer.id !== user.id) {
      throw new UnauthorizedException();
    }

    if (referral.isClaimed) {
      throw new ReferralAlreadyClaimedException();
    }

    referral.isClaimed = true;
    await this.userReferralService.saveReferral(referral);

    const brandSlug = this.configService.get('BRAND_SLUG');
    const brand = await this.brandService.getBrandBySlug(brandSlug);
    let userHolding = await this.userHoldingService.getByUserIdAndBrandId(
      user.id,
      brand.id,
    );

    if (!userHolding) {
      userHolding = await this.userHoldingService.createUserHolding({
        points: referral.points,
        user: user,
        brand: brand,
      });
    } else {
      userHolding.points += referral.points;
      await this.userHoldingService.saveUserHolding(userHolding);
    }

    return await this.userRepository.findById(user.id);
  }

  async claimBonus(user: UserEntity, bonusId: string): Promise<UserEntity> {
    const bonus = await this.userBonusService.getById(bonusId);
    if (bonus.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    if (bonus.isClaimed) {
      throw new BonusAlreadyClaimedException();
    }

    bonus.isClaimed = true;
    await this.userBonusService.saveBonus(bonus);

    const brandSlug = this.configService.get('BRAND_SLUG');
    const brand = await this.brandService.getBrandBySlug(brandSlug);
    let userHolding = await this.userHoldingService.getByUserIdAndBrandId(
      user.id,
      brand.id,
    );

    if (!userHolding) {
      userHolding = await this.userHoldingService.createUserHolding({
        points: bonus.points,
        user: user,
        brand: brand,
      });
    } else {
      userHolding.points += bonus.points;
      await this.userHoldingService.saveUserHolding(userHolding);
    }

    return await this.userRepository.findById(user.id);
  }

  async getFollowing(dto: any) {
    try {
      const response = await this.httpService.axiosRef.get(
        `https://www.tiktok.com/${dto.username}/following`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching TikTok followers:', error);
      throw error;
    }
  }
}
