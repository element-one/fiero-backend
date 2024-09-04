import { Module } from '@nestjs/common';

import { EarnReceiptService } from './earn-receipt.service';

@Module({
  providers: [EarnReceiptService],
  controllers: [],
})
export class EarnReceiptModule {}
