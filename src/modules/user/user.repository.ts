import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserEntity } from '@entities/user.entity';
import { CreateSocialUserDto } from '@modules/auth/dto/create-social-user.dto';
import { LoginUserDto } from '@modules/auth/dto/login-user.dto';

import { UpdateOtpDto } from './dto/update-otp.dto';
import { UpdateResidenceDto } from './dto/update-residence.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.findOne({ where: { email } });
    return user;
  }

  async createUser(
    dto: LoginUserDto | CreateSocialUserDto,
  ): Promise<UserEntity> {
    const newUser = this.create(dto);
    return await this.save(newUser);
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.findOne({
      where: { id },
    });

    return user;
  }

  async findHoldingsById(id: string): Promise<UserEntity> {
    const user = await this.findOne({ relations: ['holdings'], where: { id } });
    return user;
  }

  async findBadgesById(id: string): Promise<UserEntity> {
    const user = await this.findOne({ relations: ['badges'], where: { id } });
    return user;
  }

  async findEarnsById(id: string): Promise<UserEntity> {
    const user = await this.findOne({ relations: ['earns'], where: { id } });
    return user;
  }

  async findRewardsById(id: string): Promise<UserEntity> {
    const user = await this.findOne({
      relations: ['rewards', 'eventRewards'],
      where: { id },
    });
    return user;
  }

  async findEventRewardsById(id: string): Promise<UserEntity> {
    const user = await this.findOne({
      relations: ['eventRewards'],
      where: { id },
    });
    return user;
  }

  async findByReferralCode(code: string): Promise<UserEntity> {
    const user = await this.findOne({ where: { referralCode: code } });
    return user;
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto | UpdateResidenceDto,
  ): Promise<UserEntity> {
    await this.update(id, dto);
    return await this.findById(id);
  }

  async updateOtp(id: string, dto: UpdateOtpDto): Promise<UserEntity> {
    await this.update(id, dto);
    return await this.findById(id);
  }
}
