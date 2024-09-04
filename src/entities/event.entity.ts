import { Column, Entity, OneToMany } from 'typeorm';

import { LocationEnum } from '@type/enum';
import { AbstractEntity } from '@type/shared/abstract.entity';

import { EarnEntity } from './earn.entity';
import { EventRewardEntity } from './event-reward.entity';
import { EventRewardRaffleEntity } from './event-reward-raffle.entity';

@Entity({ name: 'event' })
export class EventEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  slug: string;

  @Column({ nullable: false, name: 'event_at' })
  eventAt: Date;

  @Column({
    type: 'enum',
    enum: LocationEnum,
  })
  location: LocationEnum;

  @Column({ type: 'varchar', nullable: true })
  rsvp: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', nullable: true })
  headerUrl: string;

  @Column({ default: false })
  isPopular: boolean;

  @Column({ nullable: true })
  order: number;

  @Column({ nullable: false })
  brandId: string;

  @Column('jsonb', { nullable: false, default: [] })
  winners: Array<any>;

  @Column({ nullable: false, default: 1 })
  round: number;

  @OneToMany(() => EventRewardEntity, (eventReward) => eventReward.event, {
    eager: true,
  })
  eventRewards: EventRewardEntity[];

  @OneToMany(
    () => EventRewardRaffleEntity,
    (eventRaffle) => eventRaffle.event,
    {
      eager: true,
    },
  )
  eventRaffles: EventRewardRaffleEntity[];

  @OneToMany(() => EarnEntity, (earn) => earn.event, {
    eager: true,
  })
  earns: EarnEntity[];
}
