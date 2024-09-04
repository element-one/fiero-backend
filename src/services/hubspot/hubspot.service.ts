import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HubspotService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  getHeader() {
    return {
      Authorization: `Bearer ${this.configService.get('HUBSPOT_ACCESS_TOKEN')}`,
    };
  }

  async createContact(
    email: string,
    firstName?: string,
    lastName?: string,
  ): Promise<any> {
    try {
      const result = await this.httpService.axiosRef.post(
        `${this.configService.get('HUBSPOT_API_URL')}/crm/v3/objects/contacts`,
        {
          properties: {
            email: email,
            firstname: firstName,
            lastname: lastName,
          },
        },
        {
          headers: this.getHeader(),
        },
      );

      console.log('hubspot result: ', result.data);
      return result.data;
    } catch (err) {
      console.log('hubspot error: ', err.response.data);
      return null;
    }
  }
}
