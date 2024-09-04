import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { RewardEntity } from './reward.entity';

@Entity({ name: 'reward_spin_prize' })
@Unique(['reward', 'spinNumber'])
export class RewardSpinPrizeEntity extends AbstractEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  spinNumber: number;

  @Column({ nullable: false, default: false })
  isWinner: boolean;

  @Column({ nullable: false, default: 0 })
  quantity: number;

  @Column({ nullable: false, default: 0 })
  used: number;

  @ManyToOne(() => RewardEntity, (reward) => reward.spinPrizes)
  reward: RewardEntity;
}
