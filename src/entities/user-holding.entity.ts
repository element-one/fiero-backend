import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

import { BrandEntity } from './brand.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_holding' })
export class UserHoldingEntity extends AbstractEntity {
  @Column()
  points: number;

  @ManyToOne(() => UserEntity, (user) => user.holdings)
  user: UserEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.holdings, { eager: true })
  brand: BrandEntity;
}
