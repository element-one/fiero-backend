import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

import { RewardEntity } from './reward.entity';
import { RewardCustomEntity } from './reward-custom.entity';
import { RewardDeliveryEntity } from './reward-delivery.entity';
import { RewardDiscountEntity } from './reward-discount.entity';
import { RewardSpinEntity } from './reward-spin.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_reward' })
export class UserRewardEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true })
  transaction: string;

  @ManyToOne(() => UserEntity, (user) => user.earns)
  user: UserEntity;

  @Column({ type: 'bool', default: false })
  isClaimed: boolean;

  @Column({ type: 'bool', default: false })
  isRedeemed: boolean;

  @Column({ type: 'varchar', nullable: true })
  qrCode: string;

  @ManyToOne(() => RewardEntity, (reward) => reward.userRewards, {
    eager: true,
  })
  reward: RewardEntity;

  @OneToOne(() => RewardDiscountEntity, (discount) => discount.userReward, {
    eager: true,
  })
  discount: RewardDiscountEntity;

  @OneToOne(() => RewardDeliveryEntity, (delivery) => delivery.userReward, {
    eager: true,
  })
  delivery: RewardDeliveryEntity;

  @OneToOne(
    () => RewardCustomEntity,
    (rewardCustom) => rewardCustom.userReward,
    {
      eager: true,
    },
  )
  rewardCustom: RewardCustomEntity;

  @OneToOne(() => RewardSpinEntity, (rewardSpin) => rewardSpin.userReward, {
    eager: true,
  })
  rewardSpin: RewardSpinEntity;
}
