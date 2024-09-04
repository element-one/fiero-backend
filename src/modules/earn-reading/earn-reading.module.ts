import { Module } from '@nestjs/common';

import { EarnReadingService } from './earn-reading.service';

@Module({
  providers: [EarnReadingService],
  controllers: [],
})
export class EarnReadingModule {}
