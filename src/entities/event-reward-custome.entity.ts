import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { UserEventRewardEntity } from './user-event-reward.entity';

@Entity({ name: 'event_reward_custom' })
export class EventRewardCustomEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 120, nullable: false })
  email: string;

  @OneToOne(
    () => UserEventRewardEntity,
    (userEventReward) => userEventReward.eventRewardCustom,
  )
  @JoinColumn()
  userEventReward: UserEventRewardEntity;
}
