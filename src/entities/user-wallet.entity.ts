import { Column, Entity, ManyToOne } from 'typeorm';

import { WalletTypeEnum } from '@type/enum';
import { AbstractEntity } from '@type/shared/abstract.entity';

import { UserEntity } from './user.entity';

@Entity({ name: 'user_wallet' })
export class UserWalletEntity extends AbstractEntity {
  @Column({ nullable: false })
  address: string;

  @Column({
    type: 'enum',
    enum: WalletTypeEnum,
    nullable: false,
    default: WalletTypeEnum.ETH,
  })
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.wallets)
  user: UserEntity;
}
