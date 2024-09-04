import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { RewardEntity } from './reward.entity';
import { UserRewardEntity } from './user-reward.entity';

@Entity({ name: 'reward_discount' })
export class RewardDiscountEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120, nullable: false, unique: false })
  code: string;

  @OneToOne(() => UserRewardEntity, (userReward) => userReward.discount)
  @JoinColumn()
  userReward: UserRewardEntity;

  @ManyToOne(() => RewardEntity, (reward) => reward.discounts)
  reward: RewardEntity;
}
