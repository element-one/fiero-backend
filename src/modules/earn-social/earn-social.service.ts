import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse } from 'csv-parse';
import TwitterApi from 'twitter-api-v2';
import * as _ from 'lodash';

import { EarnSocialEntity } from '@entities/earn-social.entity';

import { EarnSocialRepository } from './earn-social.repository';

@Injectable()
export class EarnSocialService {
  constructor(
    private readonly earnSocialRepository: EarnSocialRepository,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async findOneBySocialId(socialId: string): Promise<EarnSocialEntity> {
    return await this.earnSocialRepository.findBySocialId(socialId);
  }

  async saveSocial(social: EarnSocialEntity): Promise<void> {
    await this.earnSocialRepository.save(social);
  }

  async checkTwitterIsFollowed(
    sourceId: string,
    targetName: string,
  ): Promise<boolean> {
    const consumerClient = new TwitterApi({
      appKey: this.configService.get('TWITTER_CLIENT_ID'),
      appSecret: this.configService.get('TWITTER_CLIENT_SECRET'),
    });

    const client = await consumerClient.appLogin();

    try {
      const followings = await client.v2.following(sourceId, {
        asPaginator: true,
      });

      for await (const user of followings) {
        if (user.username.toLowerCase() === targetName.toLowerCase()) {
          return true;
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 4));
    }
  }

  async checkTweetIsLiked(
    tweetId: string,
    sourceName: string,
  ): Promise<boolean> {
    const consumerClient = new TwitterApi({
      appKey: this.configService.get('TWITTER_CLIENT_ID'),
      appSecret: this.configService.get('TWITTER_CLIENT_SECRET'),
    });

    const client = await consumerClient.appLogin();

    const usersPaginated = await client.v2.tweetLikedBy(tweetId, {
      asPaginator: true,
    });

    for await (const user of usersPaginated) {
      if (user.username.toLowerCase() === sourceName.toLowerCase()) {
        return true;
      }
    }

    return false;
  }

  async checkTweetIsRetweeted(
    tweetId: string,
    sourceName: string,
  ): Promise<boolean> {
    const consumerClient = new TwitterApi({
      appKey: this.configService.get('TWITTER_CLIENT_ID'),
      appSecret: this.configService.get('TWITTER_CLIENT_SECRET'),
    });

    const client = await consumerClient.appLogin();

    const usersPaginated = await client.v2.tweetRetweetedBy(tweetId, {
      asPaginator: true,
    });

    for await (const user of usersPaginated) {
      if (user.username.toLowerCase() === sourceName.toLowerCase()) {
        return true;
      }
    }

    return false;
  }

  async checkInstagramIsFollowed(sourceName: string, feed: string) {
    const url = feed;
    const result = await this.httpService.axiosRef.get(url, {
      responseType: 'blob',
    });

    const output = await new Promise((resolve, reject) => {
      parse(result.data, { columns: true }, (err, output) => {
        if (err) reject(err);
        resolve(output);
      });
    });

    const found = _.find(
      output as any,
      (each: any) => each.username === sourceName,
    );
    console.log(found);

    if (found) {
      return true;
    }

    return false;
  }

  async checkInstagramIsPostCreated(sourceName: string, feed: string) {
    const url = feed;
    const result = await this.httpService.axiosRef.get(url, {
      responseType: 'blob',
    });

    const json = JSON.parse(result.data);
    const found = _.find(
      json as any,
      (each: any) => each.ownerUsername === sourceName,
    );
    console.log(found);

    if (found) {
      return true;
    }

    return false;
  }
}
