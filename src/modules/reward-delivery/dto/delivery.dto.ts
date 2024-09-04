import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

import { RewardDeliveryEntity } from '@entities/reward-delivery.entity';
import { UserRewardDto } from '@modules/user-reward/dto/user-reward.dto';

export class DeliveryDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address1: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  zipCode: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsObject()
  userReward: UserRewardDto;

  constructor(delivery: RewardDeliveryEntity) {
    this.id = delivery.id;
    this.firstName = delivery.firstName;
    this.lastName = delivery.lastName;
    this.address = delivery.address;
    this.address1 = delivery.address1;
    this.city = delivery.city;
    this.state = delivery.state;
    this.zipCode = delivery.zipCode;
    this.userReward =
      delivery.userReward && new UserRewardDto(delivery.userReward);
  }
}
