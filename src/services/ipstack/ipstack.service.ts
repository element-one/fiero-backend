import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';

@Injectable()
export class IpStackService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getResidence(ip: string): Promise<{ country: string; state: string }> {
    try {
      const result = await this.httpService.axiosRef.get(
        `${this.configService.get(
          'IP_STACK_API_URL',
        )}/${ip}?access_key=${this.configService.get('IP_STACK_API_KEY')}`,
      );

      const country = _.get(result.data, 'country_code');
      const state = _.get(result.data, 'region_code');
      return { country, state };
    } catch (err) {
      console.log('co:create error: ', err.response.data);
      return null;
    }
  }
}
