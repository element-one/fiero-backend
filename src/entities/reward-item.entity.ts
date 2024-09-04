import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { RewardEntity } from './reward.entity';

@Entity({ name: 'reward_item' })
export class RewardItemEntity extends AbstractEntity {
  @Column('jsonb', { nullable: false, default: [] })
  slots: Array<any>;

  @OneToOne(() => RewardEntity, (reward) => reward.rewardItem)
  @JoinColumn()
  reward: RewardEntity;
}
