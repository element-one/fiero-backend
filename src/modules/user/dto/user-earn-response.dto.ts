import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { UserEarnEntity } from '@entities/user-earn.entity';

export class UserEarnsResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  earns: UserEarnEntity[];
}
