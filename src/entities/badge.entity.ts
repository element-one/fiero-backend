import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity, JSONObject } from '@type/index';

import { BrandEntity } from './brand.entity';
import { EarnEntity } from './earn.entity';
import { UserBadgeEntity } from './user-badge.entity';

@Entity({ name: 'badge' })
export class BadgeEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', nullable: true })
  contractAddress: string;

  @Column({ nullable: true })
  tokenId: number;

  @Column({ type: 'varchar', nullable: true })
  openseaUrl: string;

  @Column('jsonb', { nullable: false, default: {} })
  metadata: JSONObject;

  @ManyToOne(() => BrandEntity, (brand) => brand.earns)
  brand: BrandEntity;

  @OneToMany(() => UserBadgeEntity, (userBadge) => userBadge.badge)
  userBadges: UserBadgeEntity[];

  @OneToMany(() => EarnEntity, (earn) => earn.badge)
  earns: EarnEntity[];
}
