import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

import { EventRewardCustomEntity } from '@entities/event-reward-custome.entity';
import { UserEventRewardDto } from '@modules/user-event-reward/dto/user-event-reward.dto';

export class EventCustomDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsObject()
  userEventReward: UserEventRewardDto;

  constructor(eventCustom: EventRewardCustomEntity) {
    this.id = eventCustom.id;
    this.name = eventCustom.name;
    this.email = eventCustom.email;
    this.userEventReward =
      eventCustom.userEventReward &&
      new UserEventRewardDto(eventCustom.userEventReward);
  }
}
