import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserReferralEntity } from '@entities/user-referral.entity';

import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';

@Injectable()
export class UserReferralRepository extends Repository<UserReferralEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserReferralEntity, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<UserReferralEntity> {
    const result = await this.findOne({
      relations: ['referrer'],
      where: { id },
    });
    return result;
  }

  async findByEmail(email: string): Promise<UserReferralEntity> {
    const result = await this.findOne({
      relations: ['referrer'],
      where: { email },
    });
    return result;
  }

  async findByEmailAndReferrerId(
    email: string,
    userId: string,
  ): Promise<UserReferralEntity> {
    const result = await this.findOne({
      relations: ['referrer'],
      where: { email, referrer: { id: userId } },
    });
    return result;
  }

  async findByReferrerIdAndReferralId(
    referrerId: string,
    referralId: string,
  ): Promise<UserReferralEntity> {
    const result = await this.findOne({
      relations: ['referrer', 'referral'],
      where: { referrer: { id: referrerId }, referral: { id: referralId } },
    });
    return result;
  }

  async findByReferrerId(userId: string): Promise<UserReferralEntity[]> {
    const result = await this.find({
      relations: ['referrer', 'referral'],
      where: { referrer: { id: userId } },
    });
    return result;
  }

  async findByReferralId(userId: string): Promise<UserReferralEntity> {
    const result = await this.findOne({
      relations: ['referral', 'referrer'],
      where: { referral: { id: userId } },
    });
    return result;
  }

  async createReferral(dto: CreateReferralDto): Promise<UserReferralEntity> {
    const result = this.create({ ...dto });
    return await this.save(result);
  }

  async updateReferral(
    referralId: string,
    dto: UpdateReferralDto,
  ): Promise<UserReferralEntity> {
    const referral = await this.findById(referralId);
    referral.referral = dto.referral;
    referral.isAccepted = dto.isAccepted || false;
    referral.isClaimed = dto.isClaimed || false;
    referral.isAirdropped = dto.isAirdropped || false;
    referral.isAirdropAttempted = dto.isAirdropAttempted || false;
    return await this.save(referral);
  }
}
