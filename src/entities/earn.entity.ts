import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { AbstractEntity, EarnEnum, JSONObject } from '@type/index';

import { BadgeEntity } from './badge.entity';
import { BrandEntity } from './brand.entity';
import { EarnReadingEntity } from './earn-reading.entity';
import { EarnReceiptEntity } from './earn-receipt.entity';
import { EarnSocialEntity } from './earn-social.entity';
import { EarnSurveyEntity } from './earn-survey.entity';
import { EventEntity } from './event.entity';
import { UserEarnEntity } from './user-earn.entity';
import { UserReceiptEntity } from './user-receipt.entity';

@Entity({ name: 'earn' })
export class EarnEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ default: false })
  hasHashtag: boolean;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: EarnEnum,
    default: EarnEnum.SOCIAL,
  })
  type: EarnEnum;

  @Column()
  points: number;

  @Column({ nullable: true })
  referralCount: number;

  @Column({ nullable: true })
  expiredAt: Date;

  @Column({ default: false })
  isPopular: boolean;

  @Column({ default: false })
  isHidden: boolean;

  @Column({ nullable: true })
  order: number;

  @Column('jsonb', { nullable: true, default: [] })
  states: JSONObject;

  @ManyToOne(() => BrandEntity, (brand) => brand.earns, { eager: true })
  brand: BrandEntity;

  @ManyToOne(() => BadgeEntity, (badge) => badge.earns, { eager: true })
  badge: BadgeEntity;

  @ManyToOne(() => EventEntity, (event) => event.earns)
  event: EventEntity;

  @OneToMany(() => UserEarnEntity, (userEarn) => userEarn.earn)
  userEarns: UserEarnEntity[];

  @OneToOne(() => EarnSocialEntity, (earnSocial) => earnSocial.earn, {
    eager: true,
  })
  @JoinColumn()
  earnSocial: EarnSocialEntity;

  @OneToMany(() => EarnSurveyEntity, (earnSurvey) => earnSurvey.earn, {
    eager: true,
  })
  earnSurveys: EarnSurveyEntity[];

  @OneToMany(() => EarnReadingEntity, (earnReading) => earnReading.earn, {
    eager: true,
  })
  earnReadings: EarnReadingEntity[];

  @OneToMany(() => UserReceiptEntity, (userReceipts) => userReceipts.earn)
  userReceipts: UserReceiptEntity[];

  @OneToOne(() => EarnReceiptEntity, (earnReceipt) => earnReceipt.earn, {
    eager: true,
  })
  earnReceipt: EarnReceiptEntity;
}
