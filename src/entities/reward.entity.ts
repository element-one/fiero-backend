import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity, JSONObject, RewardEnum } from '@type/index';

import { BrandEntity } from './brand.entity';
import { RewardDiscountEntity } from './reward-discount.entity';
import { RewardItemEntity } from './reward-item.entity';
import { RewardRaffleEntity } from './reward-raffle.entity';
import { RewardSpinPrizeEntity } from './reward-spin-prize.entity';
import { UserRewardEntity } from './user-reward.entity';

@Entity({ name: 'reward' })
export class RewardEntity extends AbstractEntity {
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
    enum: RewardEnum,
    default: RewardEnum.DISCOUNT,
  })
  type: RewardEnum;

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

  @Column('jsonb', { nullable: false, default: [] })
  winners: Array<any>;

  @Column({ nullable: false, default: 1 })
  round: number;

  @Column({ nullable: true })
  liveAt: Date;

  @Column('jsonb', { nullable: false, default: [] })
  tags: string[];

  @ManyToOne(() => BrandEntity, (brand) => brand.earns, { eager: true })
  brand: BrandEntity;

  @OneToMany(() => RewardDiscountEntity, (discount) => discount.reward)
  discounts: RewardDiscountEntity[];

  @OneToMany(() => UserRewardEntity, (userReward) => userReward.reward)
  userRewards: UserRewardEntity[];

  @OneToMany(() => RewardRaffleEntity, (raffles) => raffles.reward)
  raffles: RewardRaffleEntity[];

  @OneToOne(() => RewardItemEntity, (rewardItem) => rewardItem.reward, {
    eager: true,
  })
  rewardItem: RewardItemEntity;

  @OneToMany(() => RewardSpinPrizeEntity, (spinPrize) => spinPrize.reward, {
    eager: true,
  })
  spinPrizes: RewardSpinPrizeEntity[];
}
