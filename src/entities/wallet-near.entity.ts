import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

@Entity({ name: 'wallet_near' })
export class WalletNearEntity extends AbstractEntity {
  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false, default: false })
  isAssigned: boolean;
}
