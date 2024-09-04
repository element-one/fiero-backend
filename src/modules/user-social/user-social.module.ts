import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSocialEntity } from '@entities/user-social.entity';

import { UserSocialRepository } from './use-social.repository';
import { UserSocialService } from './user-social.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSocialEntity])],
  controllers: [],
  providers: [UserSocialService, UserSocialRepository],
  exports: [UserSocialService],
})
export class UserSocialModule {}
