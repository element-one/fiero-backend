import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { JSONObject } from '@type/common';
import { AbstractEntity } from '@type/shared/abstract.entity';

import { EarnEntity } from './earn.entity';
import { UserEntity } from './user.entity';
import { UserReceiptEntity } from './user-receipt.entity';

@Entity({ name: 'user_earn' })
export class UserEarnEntity extends AbstractEntity {
  @Column({ default: false })
  isPending: boolean;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: false })
  isClaimed: boolean;

  @Column({ default: false })
  isAirdropped: boolean;

  @Column({ default: false })
  isAirdropAttempted: boolean;

  @Column('jsonb', { nullable: false, default: {} })
  answers: JSONObject;

  @Column('jsonb', { nullable: false, default: {} })
  invites: JSONObject;

  @Column({ type: 'varchar', nullable: true })
  transaction: string;

  @OneToOne(() => UserReceiptEntity, (userReceipt) => userReceipt.userEarn, {
    eager: true,
  })
  @JoinColumn()
  userReceipt: UserReceiptEntity;

  @ManyToOne(() => UserEntity, (user) => user.earns)
  user: UserEntity;

  @ManyToOne(() => EarnEntity, (earn) => earn.userEarns, { eager: true })
  earn: EarnEntity;
}
