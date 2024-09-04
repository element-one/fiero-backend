import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UtilsService } from '@services/utils/utils.service';

@Injectable()
export class CoCreateService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly utilsService: UtilsService,
  ) {}

  getHeader() {
    return {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${this.configService.get('COCREATE_API_KEY')}`,
    };
  }

  async getUser(email: string): Promise<any> {
    try {
      const result = await this.httpService.axiosRef.get(
        `${this.configService.get('COCREATE_URL')}/user?email=${email}`,
        {
          headers: this.getHeader(),
        },
      );

      console.log('co:create result: ', result.data);
      return result.data;
    } catch (err) {
      console.log('co:create error: ', err.response.data);
      return null;
    }
  }

  async createUser(email: string): Promise<any> {
    console.log('email: ', email);
    try {
      const result = await this.httpService.axiosRef.post(
        `${this.configService.get('COCREATE_URL')}/user`,
        {
          email,
        },
        {
          headers: this.getHeader(),
        },
      );

      return result.data;
    } catch (err) {
      console.log('co:create error: ', err.response.data);
      return null;
    }
  }

  async updateUser(email: string, wallet: string): Promise<any> {
    try {
      const result = await this.httpService.axiosRef.patch(
        `${this.configService.get('COCREATE_URL')}/user`,
        {
          email,
          external_wallets: [wallet],
        },
        {
          headers: this.getHeader(),
        },
      );

      return result.data;
    } catch (err) {
      console.log('co:create error: ', err.response.data);
      return null;
    }
  }

  async mintErc1155(
    earnId: string,
    tokenId: number,
    points: number,
    wallet: string,
  ) {
    console.log(this.utilsService.encodeString(earnId));
    console.log(tokenId);
    console.log(points);
    console.log(wallet);
    try {
      const result = await this.httpService.axiosRef.post(
        `${this.configService.get('COCREATE_URL')}/erc1155/mint/async`,
        {
          erc1155_id: this.configService.get('COCREATE_ERC1155_ID'),
          token_ids: [tokenId],
          mint_quantities: [points],
          wallet_addresses: [wallet.toLowerCase()],
          mint_metadata: this.utilsService.encodeString(earnId),
        },
        {
          headers: this.getHeader(),
        },
      );

      console.log('co:create result: ', result.data);
    } catch (err) {
      console.log('co:create error: ', err.response.data);
    }
  }
}
