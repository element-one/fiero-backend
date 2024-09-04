import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import { PageDto, PageMetaDto } from '@dtos/page';
import { RewardEntity } from '@entities/reward.entity';
import { RewardSpinEntity } from '@entities/reward-spin.entity';
import { RewardSpinPrizeEntity } from '@entities/reward-spin-prize.entity';
import { UserEntity } from '@entities/user.entity';
import { UserRewardEntity } from '@entities/user-reward.entity';
import { DidNotWinException } from '@exceptions/did-not-win';
import { InvaildRewardTypeException } from '@exceptions/invalid-reward-type';
import { PresentNotFoundException } from '@exceptions/present-not-found';
import { PrizesDrawnException } from '@exceptions/prizes-drawn';
import { RewardAlreadyClaimedException } from '@exceptions/reward-already-claimed';
import { RewardAlreadyCustomException } from '@exceptions/reward-already-custom';
import { RewardNotAvailableException } from '@exceptions/reward-not-available';
import { RewardNotEnoughTokenException } from '@exceptions/reward-not-enough-token';
import { RewardNotFoundException } from '@exceptions/reward-not-found';
import { UserResidenceRestrictedException } from '@exceptions/user-residence-restricted';
import { UserRewardNotFoundException } from '@exceptions/user-reward-not-found';
import { AddCustomDto } from '@modules/reward-custom/dto/add-custom.dto';
import { RewardCustomService } from '@modules/reward-custom/reward-custom.service';
import { DeliveryService } from '@modules/reward-delivery/delivery.service';
import { AddDeliveryDto } from '@modules/reward-delivery/dto/add-delivery.dto';
import { DiscountService } from '@modules/reward-discount/discount.service';
import { RewardRaffleService } from '@modules/reward-raffle/reward-raffle.service';
import { UserSpinResponseDto } from '@modules/reward-spin/dto/user-spin-response';
import { RewardSpinService } from '@modules/reward-spin/reward-spin.service';
import { UserHoldingService } from '@modules/user-holding/user-holding.service';
import { UserRewardService } from '@modules/user-reward/user-reward.service';
import { SesService } from '@services/aws/ses.service';
import { RewardEnum } from '@type/enum';
import { getRandomInt, randomString } from '@utils/common';

import { RewardDto } from './dto/reward.dto';
import { RewardParamsDto } from './dto/reward-params.dto';
import { RewardRepository } from './reward.repository';

@Injectable()
export class RewardService {
  constructor(
    private readonly rewardRepository: RewardRepository,
    private readonly discountService: DiscountService,
    private readonly deliveryService: DeliveryService,
    private readonly userRewardService: UserRewardService,
    private readonly userHoldingService: UserHoldingService,
    private readonly sesService: SesService,
    private readonly rewardCustomService: RewardCustomService,
    private readonly rewardRaffleService: RewardRaffleService,
    private readonly rewardSpinService: RewardSpinService,
  ) {}

  async getById(rewardId: string): Promise<RewardEntity> {
    return await this.rewardRepository.findById(rewardId);
  }

  async getRewards(
    pageOptionsDto: RewardParamsDto,
  ): Promise<PageDto<RewardDto>> {
    const queryBuilder = this.rewardRepository.createQueryBuilder('reward');

    queryBuilder
      .leftJoinAndSelect('reward.brand', 'brand')
      .leftJoinAndSelect('reward.spinPrizes', 'spinPrizes')
      .orderBy('reward.createdAt', pageOptionsDto.order)
      .where('reward.isHidden = :isHidden', { isHidden: false })
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (pageOptionsDto.isPopular) {
      queryBuilder.andWhere('reward.isPopular = :isPopular', {
        isPopular: true,
      });
    }

    if (pageOptionsDto.slug) {
      queryBuilder.andWhere('reward.brand.slug = :slug', {
        slug: pageOptionsDto.slug,
      });
    }

    if (pageOptionsDto.filter && pageOptionsDto.filter.length > 0) {
      pageOptionsDto.filter.forEach((tag, index) => {
        const paramName = `tag${index}`;
        const queryPart = `reward.tags @> :${paramName}`;
        if (index === 0) {
          queryBuilder.andWhere(queryPart, {
            [paramName]: JSON.stringify([tag]),
          });
        } else {
          queryBuilder.orWhere(queryPart, {
            [paramName]: JSON.stringify([tag]),
          });
        }
      });
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getReward(userId: string, rewardId: string): Promise<RewardEntity> {
    const reward = await this.rewardRepository.findById(rewardId);
    const userReward = await this.userRewardService.getByUserIdAndRewardId(
      userId,
      rewardId,
    );
    reward['userReward'] = userReward;
    return reward;
  }

  async claimReward(
    user: UserEntity,
    rewardId: string,
  ): Promise<UserRewardEntity> {
    const reward = await this.rewardRepository.findById(rewardId);
    if (!reward) {
      throw new RewardNotFoundException();
    }

    let userReward = await this.userRewardService.getByUserIdAndRewardId(
      user.id,
      rewardId,
    );
    if (reward.type !== RewardEnum.SPIN) {
      if (userReward) {
        throw new RewardAlreadyClaimedException();
      }
    } else {
      if (!userReward) {
        throw new UserRewardNotFoundException();
      }
    }

    let userHolding = null;
    if (reward.brand) {
      userHolding = await this.userHoldingService.getByUserIdAndBrandId(
        user.id,
        reward.brand.id,
      );
    }

    if (
      reward.points > 0 &&
      (!userHolding || userHolding.points < reward.points)
    ) {
      throw new RewardNotEnoughTokenException();
    }

    if (reward.states?.length !== 0 && !user.state) {
      throw new UserResidenceRestrictedException();
    }

    if (reward.states?.length !== 0 && !_.includes(reward.states, user.state)) {
      throw new UserResidenceRestrictedException();
    }

    if (reward.type === RewardEnum.DISCOUNT) {
      // check discount still available
      const discount = await this.discountService.getUnusedByRewardId(rewardId);
      if (!discount) {
        throw new RewardNotAvailableException();
      }

      userReward = await this.userRewardService.createUserReward({
        user,
        reward,
        isClaimed: true,
      });

      discount.userReward = userReward;
      await this.discountService.saveDiscount(discount);

      // send discount code to user
      this.sesService.sendRewardEmail(discount.code, user.email);
    } else if (reward.type === RewardEnum.MERCHANDISE) {
      const userRewards = await this.userRewardService.getByRewardId(rewardId);
      if (userRewards.length >= reward.quantity) {
        throw new RewardNotAvailableException();
      }
      userReward = await this.userRewardService.createUserReward({
        user,
        reward,
        isClaimed: true,
      });
    } else if (reward.type === RewardEnum.QRCODE) {
      const userRewards = await this.userRewardService.getByRewardId(rewardId);
      if (userRewards.length >= reward.quantity) {
        throw new RewardNotAvailableException();
      }
      const qrCode = randomString(16);
      userReward = await this.userRewardService.createUserReward({
        user,
        reward,
        isClaimed: true,
        qrCode,
      });
    } else if (reward.type === RewardEnum.RAFFLE) {
      userReward = await this.userRewardService.createUserReward({
        user,
        reward,
        isClaimed: true,
      });

      await this.rewardRaffleService.createUserRaffle(user, reward);
    } else if (reward.type === RewardEnum.SPIN) {
      if (userReward.isClaimed) {
        throw new RewardAlreadyClaimedException();
      }
      if (userReward.rewardSpin.isWinner) {
        userReward.isClaimed = true;
        await this.userRewardService.saveUserReward(userReward);
      } else {
        throw new DidNotWinException();
      }
    } else {
      userReward = await this.userRewardService.createUserReward({
        user,
        reward,
        isClaimed: true,
      });
    }

    if (reward.points > 0) {
      userHolding.points -= reward.points;
      await this.userHoldingService.saveUserHolding(userHolding);
    }

    userReward = await this.userRewardService.getByUserIdAndRewardId(
      user.id,
      rewardId,
    );
    return userReward;
  }

  async redeemReward(qrCode: string) {
    return await this.userRewardService.redeemUserReward(qrCode);
  }

  async addDeliveryAddress(
    userId: string,
    rewardId: string,
    dto: AddDeliveryDto,
  ): Promise<UserRewardEntity> {
    const reward = await this.rewardRepository.findById(rewardId);
    if (!reward) {
      throw new RewardNotFoundException();
    }

    let userReward = await this.userRewardService.getByUserIdAndRewardId(
      userId,
      rewardId,
    );

    if (!userReward) {
      throw new RewardNotAvailableException();
    }

    const delivery = await this.deliveryService.createDelivery(dto);
    delivery.userReward = userReward;
    await this.deliveryService.saveDelivery(delivery);

    userReward = await this.userRewardService.getById(userReward.id);
    return userReward;
  }

  async addCustom(
    userId: string,
    rewardId: string,
    dto: AddCustomDto,
  ): Promise<UserRewardEntity> {
    const reward = await this.rewardRepository.findById(rewardId);
    if (!reward) {
      throw new RewardNotFoundException();
    }

    let userReward = await this.userRewardService.getByUserIdAndRewardId(
      userId,
      rewardId,
    );

    if (!userReward) {
      throw new RewardNotAvailableException();
    }

    const existRewardCustom = await this.rewardCustomService.getByRewardId(
      userReward.id,
    );
    if (existRewardCustom) {
      throw new RewardAlreadyCustomException();
    }

    const customer = await this.rewardCustomService.createCustom(dto);
    customer.userReward = userReward;
    await this.rewardCustomService.saveCustom(customer);

    userReward = await this.userRewardService.getById(userReward.id);
    return userReward;
  }

  async postRewardSpin(
    user: UserEntity,
    rewardId: string,
  ): Promise<UserSpinResponseDto> {
    const reward = await this.getById(rewardId);
    if (!reward) {
      throw new RewardNotFoundException();
    }

    if (reward.type !== RewardEnum.SPIN) {
      throw new InvaildRewardTypeException();
    }

    if (!reward.spinPrizes || reward.spinPrizes.length === 0) {
      throw new PresentNotFoundException();
    }

    const userReward = await this.userRewardService.getByUserIdAndRewardId(
      user.id,
      rewardId,
    );

    if (userReward) {
      return {
        spinNumber: userReward.rewardSpin.spinNumber,
        name: userReward.rewardSpin.name,
        isWinner: userReward.rewardSpin.isWinner,
        userReward,
      };
    }

    if (!reward.spinPrizes.find((p) => p.isWinner && p.quantity > p.used)) {
      throw new PrizesDrawnException();
    }

    const result = await this.executeSpinTransaction(user, rewardId);
    return result;
  }

  async executeSpinTransaction(user: UserEntity, rewardId: string) {
    const queryRunner = this.rewardRepository.getQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reward = await queryRunner.manager.findOne(RewardEntity, {
        where: { id: rewardId },
      });
      if (!reward.spinPrizes.find((p) => p.isWinner && p.quantity > p.used)) {
        throw new PrizesDrawnException();
      }

      const userReward = await queryRunner.manager.save(UserRewardEntity, {
        user,
        reward,
        isClaimed: false,
      });

      const spinPrizes = reward.spinPrizes.filter(
        (p) => !p.isWinner || p.quantity > p.used,
      );

      const randomNumber = getRandomInt(0, spinPrizes.length - 1);
      const { name, isWinner, spinNumber } = spinPrizes[randomNumber];

      await queryRunner.manager.save(RewardSpinEntity, {
        spinNumber,
        name,
        isWinner,
        user,
        reward,
        userReward,
      });

      if (isWinner) {
        await queryRunner.manager.update(
          RewardSpinPrizeEntity,
          spinPrizes[randomNumber].id,
          { used: spinPrizes[randomNumber].used + 1 },
        );
      }

      const result = {
        spinNumber,
        name,
        isWinner,
        userReward,
      };

      await queryRunner.commitTransaction();

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async softDelete(id: string) {
    await this.rewardRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id })
      .execute();
  }

  async restoreSoftDelete(id: string) {
    await this.rewardRepository
      .createQueryBuilder()
      .restore()
      .where('id = :id', { id })
      .execute();
  }
}
