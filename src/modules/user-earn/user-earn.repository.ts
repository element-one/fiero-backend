import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserEarnEntity } from '@entities/user-earn.entity';

import { CreateUserEarnDto } from './dto/create-user-earn.dto';

@Injectable()
export class UserEarnRepository extends Repository<UserEarnEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEarnEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<UserEarnEntity> {
    const result = await this.findOne({
      relations: ['user', 'earn'],
      where: { id },
    });
    return result;
  }

  async findByUserIdAndEarnId(
    userId: string,
    earnId: string,
  ): Promise<UserEarnEntity> {
    const result = await this.findOne({
      relations: ['user', 'earn'],
      where: { user: { id: userId }, earn: { id: earnId } },
    });
    return result;
  }

  async findUnAirdropped(): Promise<UserEarnEntity[]> {
    const results = await this.find({
      relations: ['user', 'earn'],
      where: {
        isClaimed: true,
        isAirdropped: false,
        isAirdropAttempted: false,
      },
    });

    return results;
  }

  async findAttemptedAirdropped(): Promise<UserEarnEntity[]> {
    const results = await this.find({
      relations: ['user', 'earn'],
      where: {
        isClaimed: true,
        isAirdropped: false,
        isAirdropAttempted: true,
      },
    });

    return results;
  }

  async createUserEarn(dto: CreateUserEarnDto): Promise<UserEarnEntity> {
    const result = this.create({ ...dto });
    return await this.save(result);
  }

  async findPending(): Promise<UserEarnEntity[]> {
    const results = await this.find({
      relations: ['user', 'earn'],
      where: { isPending: true },
    });

    return results;
  }
}
