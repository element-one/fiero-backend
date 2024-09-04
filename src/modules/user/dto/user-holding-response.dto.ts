import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { UserHoldingEntity } from '@entities/user-holding.entity';

export class UserHoldingsResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  holdings: UserHoldingEntity[];
}
