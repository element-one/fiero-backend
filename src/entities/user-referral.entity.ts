import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { UserEntity } from './user.entity';

@Entity({ name: 'user_referral' })
export class UserReferralEntity extends AbstractEntity {
  @Column({ nullable: true })
  points: number;

  @Column({ default: false })
  isAccepted: boolean;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: false })
  isClaimed: boolean;

  @Column({ default: false })
  isAirdropped: boolean;

  @Column({ default: false })
  isAirdropAttempted: boolean;

  @Column({ type: 'varchar', length: 120, nullable: false, unique: false })
  email: string;

  @ManyToOne(() => UserEntity, (user) => user.referrers)
  referrer: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.referrals)
  referral: UserEntity;
}
