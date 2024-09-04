import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { EarnEntity } from './earn.entity';

@Entity({ name: 'earn_receipt' })
export class EarnReceiptEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false })
  keywords: string;

  @OneToOne(() => EarnEntity, (earn) => earn.earnReceipt)
  @JoinColumn()
  earn: EarnEntity;
}
