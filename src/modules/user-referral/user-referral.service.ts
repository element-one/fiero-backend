import { Injectable } from '@nestjs/common';

import { UserReferralEntity } from '@entities/user-referral.entity';

import { CreateReferralDto } from './dto/create-referral.dto';
import { ReferralDto } from './dto/referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { UserReferralRepository } from './user-referral.repository';

@Injectable()
export class UserReferralService {
  constructor(
    private readonly userReferralRepository: UserReferralRepository,
  ) {}

  async getById(id: string): Promise<UserReferralEntity> {
    return await this.userReferralRepository.findById(id);
  }

  async getByEmail(email: string): Promise<UserReferralEntity> {
    return await this.userReferralRepository.findByEmail(email);
  }

  async getByReferralId(id: string): Promise<UserReferralEntity> {
    return await this.userReferralRepository.findByReferralId(id);
  }

  async getByReferrerId(id: string): Promise<ReferralDto[]> {
    // TODO: ReferralDto
    const referrals = await this.userReferralRepository.findByReferrerId(id);
    return referrals.map((referral) => new ReferralDto(referral));
  }

  async getByEmailAndReferrerId(
    email: string,
    referrerId: string,
  ): Promise<UserReferralEntity> {
    return await this.userReferralRepository.findByEmailAndReferrerId(
      email,
      referrerId,
    );
  }

  async createReferral(dto: CreateReferralDto): Promise<UserReferralEntity> {
    return await this.userReferralRepository.createReferral(dto);
  }

  async updateReferral(
    referralId: string,
    dto: UpdateReferralDto,
  ): Promise<UserReferralEntity> {
    return await this.userReferralRepository.updateReferral(referralId, dto);
  }

  async saveReferral(
    referral: UserReferralEntity,
  ): Promise<UserReferralEntity> {
    return await this.userReferralRepository.save(referral);
  }
}
