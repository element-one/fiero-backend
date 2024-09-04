import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { UserRewardEntity } from './user-reward.entity';

@Entity({ name: 'reward_custom' })
export class RewardCustomEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 120, nullable: false })
  email: string;

  @OneToOne(() => UserRewardEntity, (userReward) => userReward.rewardCustom)
  @JoinColumn()
  userReward: UserRewardEntity;
}
