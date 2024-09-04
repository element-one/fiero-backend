import { Column, Entity, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { UserEntity } from './user.entity';

@Entity({ name: 'user_bonus' })
export class UserBonusEntity extends AbstractEntity {
  @Column({ nullable: true })
  points: number;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: false })
  isClaimed: boolean;

  @Column({ default: false })
  isAirdropped: boolean;

  @Column({ default: false })
  isAirdropAttempted: boolean;

  @OneToOne(() => UserEntity, (user) => user.bonus)
  user: UserEntity;
}
