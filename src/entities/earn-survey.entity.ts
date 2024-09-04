import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity, EarnSurveyEnum, JSONObject } from '@type/index';

import { EarnEntity } from './earn.entity';

@Entity({ name: 'earn_survey' })
export class EarnSurveyEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ default: false })
  isText: boolean;

  @Column({ default: false })
  isQuestion: boolean;

  @Column({ nullable: true })
  order: number;

  @Column({
    type: 'enum',
    enum: EarnSurveyEnum,
    default: EarnSurveyEnum.SINGLE,
  })
  type: EarnSurveyEnum;

  @Column('jsonb', { nullable: false, default: [] })
  contents: JSONObject;

  @ManyToOne(() => EarnEntity, (earn) => earn.earnSurveys)
  earn: EarnEntity;
}
