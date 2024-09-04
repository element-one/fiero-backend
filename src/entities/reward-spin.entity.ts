import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { RewardEntity } from './reward.entity';
import { UserEntity } from './user.entity';
import { UserRewardEntity } from './user-reward.entity';

@Entity({ name: 'reward_spin' })
export class RewardSpinEntity extends AbstractEntity {
  @Column({ type: 'int4' })
  spinNumber: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ nullable: false, default: false })
  isWinner: boolean;

  @ManyToOne(() => RewardEntity, (reward) => reward)
  reward: RewardEntity;

  @ManyToOne(() => UserEntity, (user) => user.eventRaffles)
  user: UserEntity;

  @OneToOne(() => UserRewardEntity, (userReward) => userReward.rewardSpin)
  @JoinColumn()
  userReward: UserRewardEntity;
}
