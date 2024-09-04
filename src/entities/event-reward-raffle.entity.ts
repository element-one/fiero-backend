import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { EventEntity } from './event.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'event_reward_raffle' })
export class EventRewardRaffleEntity extends AbstractEntity {
  @Column({ type: 'int4' })
  token: number;

  @Column({ nullable: false, default: false })
  isRedeemed: boolean;

  @Column({ nullable: false, default: 1 })
  round: number;

  @ManyToOne(() => EventEntity, (event) => event.eventRaffles)
  event: EventEntity;

  @ManyToOne(() => UserEntity, (user) => user.eventRaffles)
  user: UserEntity;
}
