import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { UserDto } from '@modules/user/dto/user.dto';

export class UserResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  user: UserDto;
}
