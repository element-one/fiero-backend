import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

import { EarnEntity } from './earn.entity';
import { RewardEntity } from './reward.entity';
import { UserHoldingEntity } from './user-holding.entity';

@Entity({ name: 'brand' })
export class BrandEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  slug: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', nullable: true })
  iconUrl: string;

  @Column({ type: 'varchar', nullable: true })
  bannerUrl: string;

  @Column({ type: 'varchar', nullable: true })
  callAction: string;

  @Column({ default: false })
  isHidden: boolean;

  @Column({ nullable: true })
  order: number;

  @Column({ nullable: true })
  tokenId: number;

  @Column({ nullable: true })
  tokenSymbol: string;

  @OneToMany(() => EarnEntity, (earn) => earn.brand)
  earns: EarnEntity[];

  @OneToMany(() => UserHoldingEntity, (holding) => holding.user)
  holdings: UserHoldingEntity[];

  @OneToMany(() => RewardEntity, (reward) => reward.brand)
  rewards: RewardEntity[];
}
