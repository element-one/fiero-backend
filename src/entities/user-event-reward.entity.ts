import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

import { EventRewardEntity } from './event-reward.entity';
import { EventRewardCustomEntity } from './event-reward-custome.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_event_reward' })
export class UserEventRewardEntity extends AbstractEntity {
  @Column({ type: 'bool', default: false })
  isClaimed: boolean;

  @Column({ type: 'bool', default: false })
  isRedeemed: boolean;

  @Column({ type: 'varchar', nullable: true })
  qrCode: string;

  @ManyToOne(() => UserEntity, (user) => user.earns)
  user: UserEntity;

  @ManyToOne(
    () => EventRewardEntity,
    (eventReward) => eventReward.userEventRewards,
    {
      eager: true,
    },
  )
  eventReward: EventRewardEntity;

  @OneToOne(
    () => EventRewardCustomEntity,
    (eventRewardCustom) => eventRewardCustom.userEventReward,
    {
      eager: true,
    },
  )
  eventRewardCustom: EventRewardCustomEntity;
}
