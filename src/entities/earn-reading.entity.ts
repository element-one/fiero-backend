import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@type/index';

import { EarnEntity } from './earn.entity';

@Entity({ name: 'earn_reading' })
export class EarnReadingEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar' })
  imageUrl: string;

  @Column({ nullable: true })
  order: number;

  @ManyToOne(() => EarnEntity, (earn) => earn.earnReadings)
  earn: EarnEntity;
}
