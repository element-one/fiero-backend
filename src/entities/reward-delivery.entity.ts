import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { UserRewardEntity } from './user-reward.entity';

@Entity({ name: 'reward_delivery' })
export class RewardDeliveryEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 120, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  address1: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  state: string;

  @Column({ type: 'varchar', nullable: false })
  zipCode: string;

  @OneToOne(() => UserRewardEntity, (userReward) => userReward.delivery)
  @JoinColumn()
  userReward: UserRewardEntity;
}
