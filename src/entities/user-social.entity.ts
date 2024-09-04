import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

import { UserEntity } from './user.entity';

@Entity({ name: 'user_social' })
export class UserSocialEntity extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  socialId: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: false })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  profileImageUrl: string;

  @Exclude()
  @Column({ nullable: false })
  code: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.socials)
  user: UserEntity;
}
