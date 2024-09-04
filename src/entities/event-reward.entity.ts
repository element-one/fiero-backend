import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import {
  AbstractEntity,
  EventRewardEnum,
  EventRewardUsageEnum,
  JSONObject,
} from '@type/index';

import { EventEntity } from './event.entity';
import { UserEventRewardEntity } from './user-event-reward.entity';

@Entity({ name: 'event_reward' })
export class EventRewardEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  restriction: string;

  @Column('jsonb', { nullable: true, default: [] })
  states: JSONObject;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: EventRewardEnum,
    default: EventRewardEnum.MERCHANDISE,
  })
  type: EventRewardEnum;

  @Column({
    type: 'enum',
    enum: EventRewardUsageEnum,
    default: EventRewardUsageEnum.SINGLE,
  })
  usage: EventRewardUsageEnum;

  @Column()
  points: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ nullable: true })
  expiredAt: Date;

  @Column({ default: false })
  isPopular: boolean;

  @Column({ default: false })
  isHidden: boolean;

  @Column({ default: false })
  isComing: boolean;

  @Column({ nullable: true })
  order: number;

  @ManyToOne(() => EventEntity, (event) => event.eventRewards)
  event: EventEntity;

  @OneToMany(
    () => UserEventRewardEntity,
    (userEventReward) => userEventReward.eventReward,
  )
  userEventRewards: UserEventRewardEntity[];
}
