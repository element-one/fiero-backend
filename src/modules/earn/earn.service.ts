import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

import { PageDto, PageMetaDto } from '@dtos/page';
import { EarnEntity } from '@entities/earn.entity';
import { EarnSocialEntity } from '@entities/earn-social.entity';
import { UserEntity } from '@entities/user.entity';
import { UserEarnEntity } from '@entities/user-earn.entity';
import {
  CantClaimEarnException,
  CantCompleteEarnException,
  EarnNotCompletedException,
  EarnNotFoundException,
  EarnReceiptKeywordsNotFoundException,
  ReceiptNotFoundException,
  ReferralNotFoundException,
  SocialEmptyUsernameException,
  SocialNotLinkedException,
  SurveyNotFoundException,
} from '@exceptions/index';
import { ReceiptNotRecognizedException } from '@exceptions/receipt-not-recognized';
import { SocialFetchContentException } from '@exceptions/social-fetch-content-failed';
import { UserResidenceRestrictedException } from '@exceptions/user-residence-restricted';
import { BadgeService } from '@modules/badge/badge.service';
import { EarnSocialService } from '@modules/earn-social/earn-social.service';
import { OpenAiService } from '@modules/openai/openai.service';
import { UserService } from '@modules/user/user.service';
import { UserBadgeService } from '@modules/user-badge/user-badge.service';
import { UserBonusService } from '@modules/user-bonus/user-bonus.service';
import { UserEarnService } from '@modules/user-earn/user-earn.service';
import { UserHoldingService } from '@modules/user-holding/user-holding.service';
import { UserReceiptService } from '@modules/user-receipt/user-receipt.service';
import { UserReferralService } from '@modules/user-referral/user-referral.service';
import { S3Service } from '@services/aws/s3.service';
import { EarnEnum, EarnSocialEnum, Order } from '@type/enum';
import { isTrue } from '@utils/common';
import {
  findHashtag,
  getInstagramUser,
  getTikTokUser,
  getTwitterUser,
} from 'src/utils/social';

import { CheckReceiptDto } from './dto/check-receipt.dto';
import { CompleteEarnDto } from './dto/complete-earn.dto';
import { EarnDto } from './dto/earn.dto';
import { EarnParamsDto } from './dto/earn-params.dto';
import { WidgetParamsDto } from './dto/widget-params.dto';
import { WidgetResponseDto } from './dto/widget-response.dto';
import { EarnRepository } from './earn.repository';

@Injectable()
export class EarnService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
    private readonly earnRepository: EarnRepository,
    private readonly earnSocialService: EarnSocialService,
    private readonly badgeService: BadgeService,
    private readonly userReferralService: UserReferralService,
    private readonly userBonusService: UserBonusService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly userEarnService: UserEarnService,
    private readonly userBadgeService: UserBadgeService,
    private readonly userHoldingService: UserHoldingService,
    private readonly openAiService: OpenAiService,
    private readonly userReceiptService: UserReceiptService,
  ) {}

  async getById(earnId: string): Promise<EarnEntity> {
    return await this.earnRepository.findById(earnId);
  }

  async getEarns(pageOptionsDto: EarnParamsDto): Promise<PageDto<EarnDto>> {
    const { entities, itemCount } = await this.earnRepository.findByParams(
      pageOptionsDto,
    );
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getWidgetEarn(params: WidgetParamsDto): Promise<WidgetResponseDto> {
    const { entities } = await this.earnRepository.findByParams({
      slug: params.slug,
      take: params.count || 4,
      order: Order.DESC,
    } as EarnParamsDto);

    return { earns: entities };
  }

  async getEarn(userId: string, earnId: string): Promise<EarnEntity> {
    const earn = await this.earnRepository.findById(earnId);
    const userEarn = await this.userEarnService.getByUserIdAndEarnId(
      userId,
      earnId,
    );
    earn['userEarn'] = userEarn;
    return earn;
  }

  async markReferralComplete(user: UserEntity): Promise<void> {
    const referral = await this.userReferralService.getByReferralId(user.id);
    if (!referral) return;
    if (referral.isCompleted) return;

    referral.isCompleted = true;
    await this.userReferralService.saveReferral(referral);
  }

  async markBonusComplete(user: UserEntity): Promise<void> {
    const bonus = await this.userBonusService.getByUserId(user.id);
    if (!bonus) return;
    if (bonus.isCompleted) return;

    bonus.isCompleted = true;
    await this.userBonusService.saveBonus(bonus);
  }

  async completeTwitterEarn(
    earnSocial: EarnSocialEntity,
    user: UserEntity,
    earn: EarnEntity,
  ): Promise<UserEarnEntity> {
    const existingUserEarn = await this.userEarnService.getByUserIdAndEarnId(
      user.id,
      earn.id,
    );

    if (existingUserEarn?.isCompleted) {
      return existingUserEarn;
    }

    const userTwitter = await getTwitterUser(user);

    if (earnSocial.type === EarnSocialEnum.TWITTER_FOLLOW) {
      const isFollowing = await this.earnSocialService.checkTwitterIsFollowed(
        userTwitter.socialId,
        earnSocial.account,
      );

      if (isFollowing) {
        const userEarn = await this.userEarnService.createUserEarn({
          isCompleted: true,
          user,
          earn,
        });

        const badge = await this.badgeService.getById(userEarn.earn.badge.id);

        await this.userBadgeService.createUserBadge({
          isCompleted: true,
          user,
          badge,
        });

        await this.markReferralComplete(user);
        await this.markBonusComplete(user);

        return await this.userEarnService.getById(userEarn.id);
      }
    }

    if (earnSocial.type === EarnSocialEnum.TWITTER_LIKE) {
      const isLiked = await this.earnSocialService.checkTweetIsLiked(
        earnSocial.tweetId,
        userTwitter.username,
      );

      if (isLiked) {
        const userEarn = await this.userEarnService.createUserEarn({
          isCompleted: true,
          user,
          earn,
        });

        const badge = await this.badgeService.getById(userEarn.earn.badge.id);

        await this.userBadgeService.createUserBadge({
          isCompleted: true,
          user,
          badge,
        });

        await this.markReferralComplete(user);
        await this.markBonusComplete(user);

        return await this.userEarnService.getById(userEarn.id);
      }
    }

    if (earnSocial.type === EarnSocialEnum.TWITTER_RETWEET) {
      const isRetweeted = await this.earnSocialService.checkTweetIsRetweeted(
        earnSocial.tweetId,
        userTwitter.username,
      );

      if (isRetweeted) {
        const userEarn = await this.userEarnService.createUserEarn({
          isCompleted: true,
          user,
          earn,
        });

        const badge = await this.badgeService.getById(userEarn.earn.badge.id);

        await this.userBadgeService.createUserBadge({
          isCompleted: true,
          user,
          badge,
        });

        await this.markReferralComplete(user);
        await this.markBonusComplete(user);

        return await this.userEarnService.getById(userEarn.id);
      }
    }
  }

  async completeInstagramEarn(
    social: EarnSocialEntity,
    user: UserEntity,
    earn: EarnEntity,
    dto: CompleteEarnDto,
  ): Promise<UserEarnEntity> {
    const existingUserEarn = await this.userEarnService.getByUserIdAndEarnId(
      user.id,
      earn.id,
    );

    if (existingUserEarn?.isCompleted) {
      return existingUserEarn;
    }

    const userInstagram = await getInstagramUser(user);

    if (social.type === EarnSocialEnum.INSTAGRAM_FOLLOW) {
      const isFollowing = await this.earnSocialService.checkInstagramIsFollowed(
        userInstagram.username,
        social.feed,
      );

      if (isFollowing) {
        const userEarn = await this.userEarnService.createUserEarn({
          isCompleted: true,
          user,
          earn,
        });

        const badge = await this.badgeService.getById(userEarn.earn.badge.id);

        await this.userBadgeService.createUserBadge({
          isCompleted: true,
          user,
          badge,
        });

        await this.markReferralComplete(user);
        await this.markBonusComplete(user);

        return await this.userEarnService.getById(userEarn.id);
      } else {
        // pending
        const userEarn = await this.userEarnService.createUserEarn({
          isPending: true,
          user,
          earn,
        });

        return userEarn;
      }
    }

    if (social.type === EarnSocialEnum.INSTAGRAM_POST) {
      if (isTrue(this.configService.get('INSTAGRAM_ENABLED'))) {
        let content = null;
        if (dto.postUrl) {
          if (!userInstagram.username) {
            throw new SocialEmptyUsernameException();
          }

          content = await this.getContentByUrl(dto.postUrl);
          if (!content.includes(userInstagram.username)) {
            throw new EarnNotCompletedException();
          }
        } else {
          if (!dto.id || !dto.caption) {
            throw new EarnNotCompletedException();
          }
          content = dto.caption;
        }

        const hashtag = findHashtag(social.hashtag);

        if (hashtag.length === 0) {
          throw new EarnNotCompletedException();
        }

        if (content.includes(hashtag)) {
          const userEarn = await this.userEarnService.createUserEarn({
            isCompleted: true,
            user,
            earn,
          });

          const badge = await this.badgeService.getById(userEarn.earn.badge.id);

          await this.userBadgeService.createUserBadge({
            isCompleted: true,
            user,
            badge,
          });

          return userEarn;
        } else {
          throw new EarnNotCompletedException();
        }
      } else {
        const isCreated =
          await this.earnSocialService.checkInstagramIsPostCreated(
            userInstagram.username,
            social.feed,
          );

        if (isCreated) {
          const userEarn = await this.userEarnService.createUserEarn({
            isCompleted: true,
            user,
            earn,
          });

          const badge = await this.badgeService.getById(userEarn.earn.badge.id);

          await this.userBadgeService.createUserBadge({
            isCompleted: true,
            user,
            badge,
          });

          await this.markReferralComplete(user);
          await this.markBonusComplete(user);

          return userEarn;
        } else {
          const userEarn = await this.userEarnService.createUserEarn({
            isPending: true,
            user,
            earn,
          });

          return userEarn;
        }
      }
    }
  }

  async completeTiktokEarn(
    social: EarnSocialEntity,
    user: UserEntity,
    earn: EarnEntity,
    dto: CompleteEarnDto,
  ): Promise<UserEarnEntity> {
    const existingUserEarn = await this.userEarnService.getByUserIdAndEarnId(
      user.id,
      earn.id,
    );

    if (existingUserEarn?.isCompleted) {
      return existingUserEarn;
    }

    const userTiktok = await getTikTokUser(user);

    if (social.type === EarnSocialEnum.TIKTOK_FOLLOW) {
      const isFollowing = await this.earnSocialService.checkInstagramIsFollowed(
        userTiktok.username,
        social.feed,
      );

      if (isFollowing) {
        const userEarn = await this.userEarnService.createUserEarn({
          isCompleted: true,
          user,
          earn,
        });

        const badge = await this.badgeService.getById(userEarn.earn.badge.id);

        await this.userBadgeService.createUserBadge({
          isCompleted: true,
          user,
          badge,
        });

        await this.markReferralComplete(user);
        await this.markBonusComplete(user);

        return await this.userEarnService.getById(userEarn.id);
      } else {
        // pending
        const userEarn = await this.userEarnService.createUserEarn({
          isPending: true,
          user,
          earn,
        });

        return userEarn;
      }
    }

    if (social.type === EarnSocialEnum.TIKTOK_POST) {
      if (isTrue(this.configService.get('TIKTOK_ENABLED'))) {
        let content = null;
        if (dto.postUrl) {
          if (!userTiktok.username) {
            throw new SocialEmptyUsernameException();
          }

          content = await this.getContentByUrl(dto.postUrl);
          if (!content.includes(userTiktok.username)) {
            throw new EarnNotCompletedException();
          }
        } else {
          if (!dto.id || !dto.caption) {
            throw new EarnNotCompletedException();
          }
          content = dto.caption;
        }

        const hashtag = findHashtag(social.hashtag);

        if (hashtag.length === 0) {
          throw new EarnNotCompletedException();
        }

        if (content.includes(hashtag)) {
          const userEarn = await this.userEarnService.createUserEarn({
            isCompleted: true,
            user,
            earn,
          });

          const badge = await this.badgeService.getById(userEarn.earn.badge.id);

          await this.userBadgeService.createUserBadge({
            isCompleted: true,
            user,
            badge,
          });

          return userEarn;
        } else {
          throw new EarnNotCompletedException();
        }
      } else {
        const userEarn = await this.userEarnService.createUserEarn({
          isCompleted: true,
          user,
          earn,
        });

        const badge = await this.badgeService.getById(userEarn.earn.badge.id);

        await this.userBadgeService.createUserBadge({
          isCompleted: true,
          user,
          badge,
        });

        await this.markReferralComplete(user);
        await this.markBonusComplete(user);

        return userEarn;
      }
    }
  }

  async getContentByUrl(url: string) {
    try {
      const response = await this.httpService.axiosRef.get(url);
      return response.data;
    } catch (err) {
      throw new SocialFetchContentException();
    }
  }

  async completeSurveyEarn(
    dto: CompleteEarnDto,
    user: UserEntity,
    earn: EarnEntity,
  ): Promise<UserEarnEntity> {
    if (!dto.answers || Object.keys(dto.answers).length === 0) {
      throw new CantCompleteEarnException();
    }

    const surveyIds = Object.keys(dto.answers);
    surveyIds.map((surveyId) => {
      const survey = earn.earnSurveys.find((survey) => survey.id === surveyId);
      if (!survey) {
        throw new SurveyNotFoundException();
      }
    });

    // TODO: single vs multiple
    let userEarn = await this.userEarnService.getByUserIdAndEarnId(
      user.id,
      earn.id,
    );
    if (userEarn?.isCompleted) {
      return userEarn;
    }

    if (!userEarn) {
      userEarn = await this.userEarnService.createUserEarn({
        user,
        earn,
        answers: dto.answers,
      });
    }

    // check if all answer submitted
    if (Object.keys(userEarn.answers).length === earn.earnSurveys.length) {
      userEarn.isCompleted = true;
      userEarn = await this.userEarnService.saveUserEarn(userEarn);

      const badge = await this.badgeService.getById(userEarn.earn.badge.id);
      await this.userBadgeService.createUserBadge({
        isCompleted: true,
        user,
        badge,
      });

      await this.markReferralComplete(user);
      await this.markBonusComplete(user);

      userEarn = await this.userEarnService.getById(userEarn.id);
    }

    return userEarn;
  }

  async completeReadingEarn(
    dto: CompleteEarnDto,
    user: UserEntity,
    earn: EarnEntity,
  ): Promise<UserEarnEntity> {
    if (!dto.answers || Object.keys(dto.answers).length === 0) {
      throw new CantCompleteEarnException();
    }
    const { readCount } = dto.answers;

    let userEarn = await this.userEarnService.getByUserIdAndEarnId(
      user.id,
      earn.id,
    );
    if (userEarn?.isCompleted) {
      return userEarn;
    }

    if (!userEarn) {
      userEarn = await this.userEarnService.createUserEarn({
        user,
        earn,
      });
    }

    // check if all answer submitted
    if (readCount === earn.earnReadings.length) {
      userEarn.isCompleted = true;
      userEarn = await this.userEarnService.saveUserEarn(userEarn);

      const badge = await this.badgeService.getById(userEarn.earn.badge.id);
      await this.userBadgeService.createUserBadge({
        isCompleted: true,
        user,
        badge,
      });

      await this.markReferralComplete(user);
      await this.markBonusComplete(user);

      userEarn = await this.userEarnService.getById(userEarn.id);
    }

    return userEarn;
  }

  async completeReceiptEarn(
    dto: CompleteEarnDto,
    user: UserEntity,
    earn: EarnEntity,
  ): Promise<UserEarnEntity> {
    if (!dto.userReceiptId) {
      throw new CantCompleteEarnException();
    }

    if (earn.states?.length !== 0 && !_.includes(earn.states, user.state)) {
      throw new UserResidenceRestrictedException();
    }

    let userEarn = await this.userEarnService.getByUserIdAndEarnId(
      user.id,
      earn.id,
    );
    if (userEarn?.isCompleted) {
      return userEarn;
    }

    const userReceipt = await this.userReceiptService.getById(
      dto.userReceiptId,
    );
    if (!userReceipt) {
      throw new ReceiptNotFoundException();
    }

    if (!userEarn) {
      userEarn = await this.userEarnService.createUserEarn({
        isCompleted: true,
        user,
        earn,
        userReceipt,
      });
    }

    const badge = await this.badgeService.getById(userEarn.earn.badge.id);
    await this.userBadgeService.createUserBadge({
      isCompleted: true,
      user,
      badge,
    });

    await this.markReferralComplete(user);
    await this.markBonusComplete(user);

    userEarn = await this.userEarnService.getById(userEarn.id);

    return userEarn;
  }

  async completeEarn(
    userId: string,
    earnId: string,
    dto: CompleteEarnDto,
  ): Promise<UserEarnEntity> {
    const user = await this.userService.getById(userId);
    const earn = await this.earnRepository.findById(earnId);

    if (earn.type === EarnEnum.SOCIAL) {
      if (user.socials.length === 0) {
        throw new SocialNotLinkedException();
      }

      const { earnSocial } = earn;

      if (!earnSocial) {
        throw new CantCompleteEarnException();
      }

      if (
        earnSocial.type === EarnSocialEnum.TWITTER_FOLLOW ||
        earnSocial.type === EarnSocialEnum.TWITTER_LIKE ||
        earnSocial.type === EarnSocialEnum.TWITTER_RETWEET
      ) {
        return await this.completeTwitterEarn(earnSocial, user, earn);
      }

      if (
        earnSocial.type === EarnSocialEnum.INSTAGRAM_FOLLOW ||
        earnSocial.type === EarnSocialEnum.INSTAGRAM_POST
      ) {
        return await this.completeInstagramEarn(earnSocial, user, earn, dto);
      }

      if (
        earnSocial.type === EarnSocialEnum.TIKTOK_FOLLOW ||
        earnSocial.type === EarnSocialEnum.TIKTOK_POST
      ) {
        return await this.completeTiktokEarn(earnSocial, user, earn, dto);
      }
    } else if (earn.type === EarnEnum.SURVEY) {
      return await this.completeSurveyEarn(dto, user, earn);
    } else if (earn.type === EarnEnum.READING) {
      return await this.completeReadingEarn(dto, user, earn);
    } else if (earn.type === EarnEnum.RECEIPT) {
      return await this.completeReceiptEarn(dto, user, earn);
    }
  }

  async claimReferral(
    userId: string,
    earn: EarnEntity,
    referralId: string,
  ): Promise<UserEarnEntity> {
    let userEarn = await this.userEarnService.getByUserIdAndEarnId(
      userId,
      earn.id,
    );

    let invite = userEarn.invites[referralId];

    if (!invite) {
      throw new ReferralNotFoundException();
    }

    if (!invite['isCompleted']) {
      throw new CantClaimEarnException();
    }

    invite = {
      ...(invite as any),
      isInvited: true,
      isCompleted: true,
      isClaimed: true,
    };
    userEarn.invites[referralId] = invite;
    await this.userEarnService.saveUserEarn(userEarn);

    const inviteCount = Object.values(userEarn.invites).filter(
      (invite) => invite['isClaimed'] === true,
    ).length;

    // only when last invite is claimed
    if (inviteCount === earn.referralCount) {
      userEarn.isClaimed = true;
      userEarn = await this.userEarnService.saveUserEarn(userEarn);

      const badgeId = userEarn.earn.badge.id;
      let userBadge = await this.userBadgeService.getByUserIdAndBadgeId(
        userId,
        badgeId,
      );

      if (!userBadge.isCompleted) {
        throw new CantClaimEarnException();
      }

      userBadge.isClaimed = true;
      userBadge = await this.userBadgeService.saveUserBadge(userBadge);
    }

    const brandId = userEarn.earn.brand.id;
    let userHolding = await this.userHoldingService.getByUserIdAndBrandId(
      userId,
      brandId,
    );

    if (!userHolding) {
      userHolding = await this.userHoldingService.createUserHolding({
        points: userEarn.earn.points,
        user: userEarn.user,
        brand: userEarn.earn.brand,
      });
    } else {
      userHolding.points += userEarn.earn.points;
      await this.userHoldingService.saveUserHolding(userHolding);
    }

    return userEarn;
  }

  async claimEarn(userId: string, earnId: string): Promise<UserEarnEntity> {
    // other earn types
    let userEarn = await this.userEarnService.getByUserIdAndEarnId(
      userId,
      earnId,
    );

    if (!userEarn.isCompleted) {
      throw new CantClaimEarnException();
    }

    userEarn.isClaimed = true;
    userEarn = await this.userEarnService.saveUserEarn(userEarn);

    const badgeId = userEarn.earn.badge.id;
    let userBadge = await this.userBadgeService.getByUserIdAndBadgeId(
      userId,
      badgeId,
    );

    if (!userBadge.isCompleted) {
      throw new CantClaimEarnException();
    }

    userBadge.isClaimed = true;
    userBadge = await this.userBadgeService.saveUserBadge(userBadge);

    const brandId = userEarn.earn.brand.id;
    let userHolding = await this.userHoldingService.getByUserIdAndBrandId(
      userId,
      brandId,
    );

    if (!userHolding) {
      userHolding = await this.userHoldingService.createUserHolding({
        points: userEarn.earn.points,
        user: userEarn.user,
        brand: userEarn.earn.brand,
      });
    } else {
      userHolding.points += userEarn.earn.points;
      await this.userHoldingService.saveUserHolding(userHolding);
    }

    return userEarn;
  }

  async getReceiptPresignedUrl(): Promise<any> {
    const key = uuid();
    const urls = await this.s3Service.getPresignedUrl(
      key,
      'image/png',
      'receipt',
    );
    return urls;
  }

  // eslint-disable-next-line
  async checkReceipt(dto: CheckReceiptDto): Promise<any> {
    const earn = await this.getById(dto.id);
    if (!earn) {
      throw new EarnNotFoundException();
    }

    const { keywords } = earn.earnReceipt || {};
    if (!keywords || keywords.trim().length === 0) {
      throw new EarnReceiptKeywordsNotFoundException();
    }

    const keywordsArr = keywords.split(',');
    const result = await this.openAiService.getReceiptText(
      dto.receiptUrl,
      keywordsArr,
    );

    console.log(result);
    const resultLower = result.toLocaleLowerCase();

    let found = false;
    for (const item of keywordsArr) {
      if (resultLower.includes(item.toLocaleLowerCase())) {
        found = true;
        break;
      }
    }
    if (!found) {
      throw new ReceiptNotRecognizedException();
    }

    const userReceipt = await this.userReceiptService.createUserReceipt({
      receiptUrl: dto.receiptUrl,
      earn,
    });

    return { userReceiptId: userReceipt.id, earnId: earn.id };
  }

  async softDelete(id: string) {
    await this.earnRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id })
      .execute();
  }

  async restoreSoftDelete(id: string) {
    await this.earnRepository
      .createQueryBuilder()
      .restore()
      .where('id = :id', { id })
      .execute();
  }
}
