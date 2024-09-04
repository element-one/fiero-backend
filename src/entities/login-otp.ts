import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

import { UserEntity } from './user.entity';

@Entity({ name: 'login_otp' })
export class LoginOtpEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false })
  otpCode: string;

  @Column({ nullable: false })
  otpCodeSendAt: Date;

  @Column({ nullable: false })
  otpCodeExpiredAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.loginOtp)
  user: UserEntity;
}
