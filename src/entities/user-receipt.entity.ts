import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

import { EarnEntity } from './earn.entity';
import { UserEarnEntity } from './user-earn.entity';

@Entity({ name: 'user_receipt' })
export class UserReceiptEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false })
  receiptUrl: string;

  @OneToOne(() => UserEarnEntity, (userEarn) => userEarn.userReceipt)
  userEarn: UserEarnEntity;

  @ManyToOne(() => EarnEntity, (earn) => earn.userReceipts)
  earn: EarnEntity;
}
