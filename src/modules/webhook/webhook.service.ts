import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BigNumber from 'bignumber.js';
import { gql, GraphQLClient } from 'graphql-request';
import { ethers } from 'ethers';
import * as _ from 'lodash';

import * as ERC20m from '@abi/ERC20m.json';
import {
  EarnNotFoundException,
  EarnSocialNotFoundException,
  EarnTypeNotTiktokFoundException,
  UserNotFoundException,
  WebhookNotAuthenticatedException,
} from '@exceptions/index';
import { BadgeService } from '@modules/badge/badge.service';
import { EarnService } from '@modules/earn/earn.service';
import { EarnSocialService } from '@modules/earn-social/earn-social.service';
import { UserService } from '@modules/user/user.service';
import { UserBadgeService } from '@modules/user-badge/user-badge.service';
import { UserEarnService } from '@modules/user-earn/user-earn.service';
import { SesService } from '@services/aws/ses.service';
import { CoCreateService } from '@services/cocreate/cocreate.service';
import { NearService } from '@services/near/near.service';
import { UtilsService } from '@services/utils/utils.service';
import { EarnEnum, EarnSocialEnum } from '@type/enum';
import { isUUID } from '@utils/common';
import { getInstagramUser } from '@utils/social';

import { ReadyForClaimDto } from './dto/ready-for-claim.dto';

@Injectable()
export class WebhookService {
  constructor(
    private readonly configService: ConfigService,
    private readonly sesService: SesService,
    private readonly userService: UserService,
    private readonly earnSocialService: EarnSocialService,
    private readonly earnService: EarnService,
    private readonly badgeService: BadgeService,
    private readonly userEarnService: UserEarnService,
    private readonly userBadgeService: UserBadgeService,
    private readonly cocreateService: CoCreateService,
    private readonly utilsService: UtilsService,
    private readonly nearService: NearService,
  ) {}

  validateGenericApiKey(apiKey: string) {
    if (apiKey !== this.configService.get('WEBHOOK_API_KEY')) {
      throw new WebhookNotAuthenticatedException();
    }
  }

  async claimBrandToken() {
    const airdrops = await this.userEarnService.getAttemptedAirdropEarns();

    for (const airdrop of airdrops) {
      if (airdrop.earn.brand.slug !== 'glass') {
        const userWallet = _.first(airdrop.user.wallets);

        console.log(userWallet.address);

        const endpoint = this.configService.get('GLASS_POLYGON_SUBGRAPH');
        const client = new GraphQLClient(endpoint);

        const query = gql`
          query GetTokenTransfers($from: String!, $to: String!) {
            transferSingleDatas(where: { from: $from, to: $to }) {
              id
              from
              to
              value
              brandId
              data
            }
          }
        `;

        const variables = {
          from: '0x0000000000000000000000000000000000000000', // mint from contract
          to: userWallet.address,
        };

        const results = await client.request(query, variables);
        const data = _.get(results, 'transferSingleDatas', []);

        console.log(data);

        if (data.length > 0) {
          for (const transfer of data) {
            try {
              const earnId = this.utilsService.decodeString(transfer.data);
              if (!isUUID(earnId)) return;

              console.log(transfer.data);
              console.log(earnId);

              const userWallet = transfer.to;
              const user = null; // await this.userService.getByWalletAddress(
              //   userWallet,
              // );
              if (!user) {
                continue;
              }

              const earn = await this.userEarnService.getByUserIdAndEarnId(
                user.id,
                earnId,
              );

              if (!earn) {
                continue;
              }

              earn.isAirdropped = true;
              earn.transaction = transfer.id;
              await this.userEarnService.saveUserEarn(earn);
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    }
  }

  async claimGlassToken() {
    const airdrops = await this.userEarnService.getAttemptedAirdropEarns();

    for (const airdrop of airdrops) {
      if (airdrop.earn.brand.slug === 'glass') {
        const userWallet = _.first(airdrop.user.wallets);

        const endpoint = this.configService.get('GLASS_POLYGON_SUBGRAPH');
        const client = new GraphQLClient(endpoint);

        const query = gql`
          query GetTokenTransfers($from: String!, $to: String!) {
            transferSingleDatas(where: { from: $from, to: $to }) {
              id
              from
              to
              value
              brandId
              data
            }
          }
        `;

        const variables = {
          from: '0x0000000000000000000000000000000000000000', // mint from contract
          to: userWallet.address,
        };

        const results = await client.request(query, variables);
        const data = _.get(results, 'transferSingleDatas', []);

        if (data.length > 0) {
          for (const transfer of data) {
            const earnId = this.utilsService.decodeString(transfer.data);
            const userWallet = transfer.to;

            const user = null; // await this.userService.getByWalletAddress(userWallet);
            // if (!user) {
            //   return;
            // }

            const earn = await this.userEarnService.getByUserIdAndEarnId(
              user.id,
              earnId,
            );

            if (!earn) {
              return;
            }

            earn.isAirdropped = true;
            await this.userEarnService.saveUserEarn(earn);
          }
        }
      }
    }
  }

  async claimNftToken() {
    const airdrops = await this.userBadgeService.getAttemptedAirdropBadges();

    console.log(airdrops);

    for (const airdrop of airdrops) {
      const badge = airdrop.badge;

      const nearWallet = airdrop.user.wallets.find(
        (wallet) => wallet.name === 'near',
      );

      console.log(badge.tokenId, nearWallet.address);
      const result = await this.nearService.getNftForOwner(nearWallet.address);

      const found = result.find((item) => item.series_id === badge.tokenId);
      if (found) {
        // mark as airdrop attempted
        airdrop.isAirdropped = true;
        airdrop.transaction = found.token_id;
        await this.userBadgeService.saveUserBadge(airdrop);

        console.log(
          `confirmed airdrop nft ${badge.tokenId} to ${nearWallet.address}`,
        );
      }
    }
  }

  async airdropGlassToken() {
    const airdrops = await this.userEarnService.getUnAirdropEarns();

    try {
      const provider = new ethers.JsonRpcProvider(
        this.configService.get('POLYGON_JSON_RPC'),
      );

      const signer = new ethers.Wallet(
        this.configService.get('GLASS_PRIVATE_KEY'),
        provider,
      );

      const tokenContract = new ethers.Contract(
        this.configService.get('GLASS_FUN_TOKEN_CONTRACT'),
        ERC20m,
        signer,
      );

      for (const airdrop of airdrops) {
        if (airdrop.earn.brand.slug === 'glass') {
          const userWallet = _.first(airdrop.user.wallets);
          const earn = airdrop.earn;

          // mark as airdrop attempted
          airdrop.isAirdropAttempted = true;
          await this.userEarnService.saveUserEarn(airdrop);

          await tokenContract.mintCustom(
            userWallet.address,
            BigNumber(earn.points * 10 ** 18).toString(),
            this.utilsService.encodeString(earn.id),
          );

          console.log(`started airdrop glass token to ${userWallet.address}`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async airdropBrandToken() {
    const airdrops = await this.userEarnService.getUnAirdropEarns();

    try {
      for (const airdrop of airdrops) {
        if (airdrop.earn.brand.slug !== 'glass') {
          const wallet = _.first(airdrop.user.wallets);
          const earn = airdrop.earn;

          // mark as airdrop attempted
          airdrop.isAirdropAttempted = true;
          await this.userEarnService.saveUserEarn(airdrop);

          let cocreateUser = await this.cocreateService.getUser(
            airdrop.user.email,
          );

          if (!cocreateUser) {
            cocreateUser = await this.cocreateService.createUser(
              airdrop.user.email,
            );
            if (cocreateUser) {
              cocreateUser = await this.cocreateService.updateUser(
                airdrop.user.email,
                wallet.address,
              );
            }
          }

          // find wallet
          const foundWallet = _.get(cocreateUser, [
            'data',
            'balances',
            wallet.address,
          ]);

          if (!foundWallet) {
            // update wallet
            cocreateUser = await this.cocreateService.updateUser(
              airdrop.user.email,
              wallet.address,
            );
          }

          await this.cocreateService.mintErc1155(
            earn.id,
            earn.brand.tokenId,
            earn.points,
            wallet.address,
          );

          console.log(`started airdrop brand token to ${wallet.address}`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async airdropNFT() {
    const airdrops = await this.userBadgeService.getUnAirdropBadges();

    try {
      for (const airdrop of airdrops) {
        try {
          const badge = airdrop.badge;

          const nearWallet = airdrop.user.wallets.find(
            (wallet) => wallet.name === 'near',
          );

          const result = await this.nearService.getNftForOwner(
            nearWallet.address,
          );
          const found = result.find((item) => item.series_id === badge.tokenId);
          if (found) return;

          console.log(badge.tokenId, nearWallet.address);
          await this.nearService.mintNft(
            badge.tokenId.toString(),
            nearWallet.address,
          );

          // mark as airdrop attempted
          airdrop.isAirdropAttempted = true;
          await this.userBadgeService.saveUserBadge(airdrop);

          console.log(
            `started airdrop nft ${badge.tokenId} to ${nearWallet.address}`,
          );
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async runInstagramCronJob() {
    const userEarns = await this.userEarnService.getPendingEarns();
    userEarns.map(async (userEarn) => {
      const earn = await this.earnService.getEarn(
        userEarn.user.id,
        userEarn.earn.id,
      );

      const { earnSocial } = earn;
      if (!earnSocial) {
        console.log(`earn.id: ${earn.id}, social is null`);
        throw new EarnSocialNotFoundException();
      }

      if (earnSocial.type === EarnSocialEnum.INSTAGRAM_FOLLOW) {
        const userInstagram = await getInstagramUser(userEarn.user);

        const isFollowing =
          await this.earnSocialService.checkInstagramIsFollowed(
            userInstagram.username,
            earnSocial.feed,
          );

        if (isFollowing) {
          userEarn.isCompleted = true;
          await this.userEarnService.saveUserEarn(userEarn);

          const badge = await this.badgeService.getById(userEarn.earn.badge.id);

          await this.userBadgeService.createUserBadge({
            isCompleted: true,
            user: userEarn.user,
            badge,
          });

          await this.earnService.markReferralComplete(userEarn.user);
          await this.earnService.markBonusComplete(userEarn.user);
        }
      }

      if (earnSocial.type === EarnSocialEnum.INSTAGRAM_POST) {
        const userInstagram = await getInstagramUser(userEarn.user);

        const isCreated =
          await this.earnSocialService.checkInstagramIsPostCreated(
            userInstagram.username,
            earnSocial.feed,
          );

        if (isCreated) {
          userEarn.isCompleted = true;
          userEarn.isPending = false;
          await this.userEarnService.createUserEarn(userEarn);

          const badge = await this.badgeService.getById(userEarn.earn.badge.id);

          await this.userBadgeService.createUserBadge({
            isCompleted: true,
            user: userEarn.user,
            badge,
          });

          await this.earnService.markReferralComplete(userEarn.user);
          await this.earnService.markBonusComplete(userEarn.user);
        }
      }
    });
  }

  async readyForClaim(dto: ReadyForClaimDto) {
    const user = await this.userService.getById(dto.userId);
    if (!user) {
      throw new UserNotFoundException(dto.userId);
    }

    const earn = await this.earnService.getById(dto.earnId);
    if (!earn) {
      throw new EarnNotFoundException(dto.earnId);
    }
    if (
      earn.type !== EarnEnum.SOCIAL ||
      (earn.earnSocial?.type !== EarnSocialEnum.TIKTOK_FOLLOW &&
        earn.earnSocial?.type !== EarnSocialEnum.TIKTOK_POST)
    ) {
      throw new EarnTypeNotTiktokFoundException(dto.earnId);
    }

    const username =
      user.firstName && user.firstName.length > 0 ? user.firstName : user.email;

    await this.sesService.sendReadyForClaimEmail(username, user.email);
  }
}
