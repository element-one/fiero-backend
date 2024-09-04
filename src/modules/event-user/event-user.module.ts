import { Module } from '@nestjs/common';

import { EventUserRepository } from './event-user.repository';
import { EventUserService } from './event-user.service';

@Module({
  imports: [],
  providers: [EventUserService, EventUserRepository],
  exports: [EventUserService],
})
export class EventUserModule {}
