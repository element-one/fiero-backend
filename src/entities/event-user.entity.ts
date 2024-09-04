import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

@Entity({ name: 'event_user' })
export class EventUserEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  dob: string;

  @Column({ nullable: true })
  phone: string;
}
