import { Column, Entity, OneToOne } from 'typeorm';

import { AbstractEntity, EarnSocialEnum } from '@type/index';

import { EarnEntity } from './earn.entity';

@Entity({ name: 'earn_social' })
export class EarnSocialEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  tweetId: string;

  @Column({ type: 'varchar', nullable: true })
  tweetContent: string;

  @Column({ type: 'varchar', nullable: true })
  account: string;

  @Column({ type: 'varchar', nullable: true })
  hashtag: string;

  @Column({ type: 'varchar', nullable: true })
  feed: string;

  @Column({
    type: 'enum',
    enum: EarnSocialEnum,
    default: EarnSocialEnum.TWITTER_FOLLOW,
  })
  type: EarnSocialEnum;

  @OneToOne(() => EarnEntity, (earn) => earn.earnSocial)
  earn: EarnEntity;
}
