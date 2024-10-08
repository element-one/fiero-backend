import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { OpenAiService } from './openai.service';

@Module({
  imports: [HttpModule],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
