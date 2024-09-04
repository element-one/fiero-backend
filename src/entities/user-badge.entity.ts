import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

import { BadgeEntity } from './badge.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_badge' })
export class UserBadgeEntity extends AbstractEntity {
  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: false })
  isClaimed: boolean;

  @Column({ default: false })
  isAirdropped: boolean;

  @Column({ default: false })
  isAirdropAttempted: boolean;

  @Column({ type: 'varchar', nullable: true })
  transaction: string;

  @ManyToOne(() => UserEntity, (user) => user.badges)
  user: UserEntity;

  @ManyToOne(() => BadgeEntity, (badge) => badge.userBadges, { eager: true })
  badge: BadgeEntity;
}
