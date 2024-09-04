import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { RewardEntity } from './reward.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'reward_raffle' })
export class RewardRaffleEntity extends AbstractEntity {
  @Column({ type: 'int4' })
  token: number;

  @Column({ nullable: false, default: false })
  isRedeemed: boolean;

  @Column({ nullable: false, default: 1 })
  round: number;

  @ManyToOne(() => RewardEntity, (reward) => reward.raffles)
  reward: RewardEntity;

  @ManyToOne(() => UserEntity, (user) => user.eventRaffles)
  user: UserEntity;
}
