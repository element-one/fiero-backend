import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

import { UserEntity } from './user.entity';

@Entity({ name: 'user_login' })
export class UserLoginEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true })
  source: string;

  @Column({ type: 'varchar', nullable: true })
  ip: string;

  @ManyToOne(() => UserEntity, (user) => user.socials)
  user: UserEntity;
}
