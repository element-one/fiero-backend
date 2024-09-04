import { Injectable } from '@nestjs/common';

import { UserSocialEntity } from '@entities/user-social.entity';

import { CreateUserSocialDto } from './dto/create-user-social.dto';
import { UserSocialRepository } from './use-social.repository';

@Injectable()
export class UserSocialService {
  constructor(private readonly userSocialRepository: UserSocialRepository) {}

  async findOrCreateSocial(
    socialDto: CreateUserSocialDto,
  ): Promise<UserSocialEntity> {
    const social = await this.userSocialRepository.findByUsernameAndType(
      socialDto.username,
      socialDto.type,
    );

    if (!social) return await this.userSocialRepository.createSocial(socialDto);

    social.token = socialDto.token;
    await this.userSocialRepository.save(social);
    return social;
  }

  async getByUsernameAndType(
    username: string,
    type: string,
  ): Promise<UserSocialEntity> {
    return await this.userSocialRepository.findByUsernameAndType(
      username,
      type,
    );
  }

  async createSocial(
    socialDto: CreateUserSocialDto,
  ): Promise<UserSocialEntity> {
    return await this.userSocialRepository.createSocial(socialDto);
  }

  async getById(id: string): Promise<UserSocialEntity> {
    return await this.userSocialRepository.findById(id);
  }

  async getBySocialId(socialId: string): Promise<UserSocialEntity> {
    return await this.userSocialRepository.findBySocialId(socialId);
  }

  async saveSocial(social: UserSocialEntity): Promise<void> {
    await this.userSocialRepository.save(social);
  }

  async removeSocial(socialId: string): Promise<void> {
    await this.userSocialRepository.delete({ id: socialId });
  }
}
