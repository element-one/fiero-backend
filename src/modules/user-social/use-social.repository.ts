import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserSocialEntity } from '@entities/user-social.entity';

import { CreateUserSocialDto } from './dto/create-user-social.dto';

@Injectable()
export class UserSocialRepository extends Repository<UserSocialEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserSocialEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<UserSocialEntity> {
    const result = await this.findOne({ relations: ['user'], where: { id } });
    return result;
  }

  async findBySocialId(socialId: string): Promise<UserSocialEntity> {
    const result = await this.findOne({ where: { socialId } });
    return result;
  }

  async findByUsernameAndType(
    username: string,
    type: string,
  ): Promise<UserSocialEntity> {
    const result = await this.findOne({ where: { username, type } });
    return result;
  }

  async createSocial(
    socialDto: CreateUserSocialDto,
  ): Promise<UserSocialEntity> {
    const result = this.create({ ...socialDto });
    return await this.save(result);
  }
}
