import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FriendshipDto {
  @ApiProperty()
  @IsString()
  readonly sourceName: string;

  @ApiProperty()
  @IsString()
  readonly targetName: string;
}
