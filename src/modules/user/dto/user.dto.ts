import { IsOptional, IsString } from 'class-validator';

import { UserEntity } from '@entities/user.entity';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.profileImageUrl = user.profileImageUrl;
  }
}
