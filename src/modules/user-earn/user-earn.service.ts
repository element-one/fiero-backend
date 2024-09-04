import { Injectable } from '@nestjs/common';

import { UserEarnEntity } from '@entities/user-earn.entity';

import { CreateUserEarnDto } from './dto/create-user-earn.dto';
import { UserEarnRepository } from './user-earn.repository';

@Injectable()
export class UserEarnService {
  constructor(private readonly userEarnRepository: UserEarnRepository) {}

  async getById(id: string): Promise<UserEarnEntity> {
    return await this.userEarnRepository.findById(id);
  }

  async createUserEarn(dto: CreateUserEarnDto): Promise<UserEarnEntity> {
    return await this.userEarnRepository.createUserEarn(dto);
  }

  async saveUserEarn(userEarn: UserEarnEntity): Promise<UserEarnEntity> {
    return await this.userEarnRepository.save(userEarn);
  }

  async getByUserIdAndEarnId(
    userId: string,
    earnId: string,
  ): Promise<UserEarnEntity> {
    return await this.userEarnRepository.findByUserIdAndEarnId(userId, earnId);
  }

  async getUnAirdropEarns(): Promise<UserEarnEntity[]> {
    return await this.userEarnRepository.findUnAirdropped();
  }

  async getAttemptedAirdropEarns(): Promise<UserEarnEntity[]> {
    return await this.userEarnRepository.findAttemptedAirdropped();
  }

  async updateSurveyAnswers(userEarn: UserEarnEntity): Promise<UserEarnEntity> {
    return await this.userEarnRepository.save(userEarn);
  }

  async getPendingEarns(): Promise<UserEarnEntity[]> {
    return await this.userEarnRepository.findPending();
  }
}
