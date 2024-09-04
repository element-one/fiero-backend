import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ReadyForClaimDto } from './dto/ready-for-claim.dto';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
@ApiTags('Webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('/cron/instagram/:apiKey')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cron job for instagram checks',
  })
  async checkInstagramCompletion(@Param('apiKey') apiKey: string) {
    this.webhookService.validateGenericApiKey(apiKey);
    await this.webhookService.runInstagramCronJob();
  }

  @Post('/cron/airdrop/:apiKey')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cron job for airdrop token',
  })
  async airdropToken(@Param('apiKey') apiKey: string) {
    this.webhookService.validateGenericApiKey(apiKey);
    // await this.webhookService.airdropGlassToken();
    // await this.webhookService.airdropBrandToken();
    await this.webhookService.airdropNFT();
  }

  @Post('/cron/claim/:apiKey')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cron job for claim token',
  })
  async claimToken(@Param('apiKey') apiKey: string) {
    this.webhookService.validateGenericApiKey(apiKey);
    // await this.webhookService.claimGlassToken();
    // await this.webhookService.claimBrandToken();
    await this.webhookService.claimNftToken();
  }

  @Post('/ready-for-claim/:apiKey')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ready for claim',
  })
  async readyForClaim(
    @Param('apiKey') apiKey: string,
    @Body() dto: ReadyForClaimDto,
  ) {
    this.webhookService.validateGenericApiKey(apiKey);
    await this.webhookService.readyForClaim(dto);
  }
}
