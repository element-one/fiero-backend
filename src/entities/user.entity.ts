import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

import { EventRewardRaffleEntity } from './event-reward-raffle.entity';
import { LoginOtpEntity } from './login-otp';
import { UserBadgeEntity } from './user-badge.entity';
import { UserBonusEntity } from './user-bonus.entity';
import { UserEarnEntity } from './user-earn.entity';
import { UserEventRewardEntity } from './user-event-reward.entity';
import { UserHoldingEntity } from './user-holding.entity';
import { UserReferralEntity } from './user-referral.entity';
import { UserRewardEntity } from './user-reward.entity';
import { UserSocialEntity } from './user-social.entity';
import { UserWalletEntity } from './user-wallet.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 120, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 120, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  profileImageUrl: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  referralCode: string;

  @Column({ type: 'varchar', nullable: true })
  brand: string;

  @Column({ type: 'varchar', nullable: true })
  otpCode: string;

  @Column({ type: 'varchar', nullable: true })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  state: string;

  @Column({ nullable: true })
  otpCodeExpiredAt: Date;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  dob: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: true })
  isFirst: boolean;

  @OneToMany(() => UserSocialEntity, (social) => social.user, { eager: true })
  socials: UserSocialEntity[];

  @OneToMany(() => UserEarnEntity, (earn) => earn.user)
  earns: UserEarnEntity[];

  @OneToMany(() => UserBadgeEntity, (badge) => badge.user)
  badges: UserBadgeEntity[];

  @OneToMany(() => UserHoldingEntity, (holding) => holding.user)
  holdings: UserHoldingEntity[];

  @OneToMany(() => UserWalletEntity, (wallet) => wallet.user, { eager: true })
  wallets: UserWalletEntity[];

  @OneToMany(() => UserReferralEntity, (referral) => referral.referrer, {
    eager: true,
  })
  referrers: UserReferralEntity[];

  @OneToMany(() => UserReferralEntity, (referral) => referral.referral)
  referrals: UserReferralEntity[];

  @OneToMany(() => UserRewardEntity, (reward) => reward.user)
  rewards: UserRewardEntity[];

  @OneToMany(() => UserEventRewardEntity, (reward) => reward.user)
  eventRewards: UserEventRewardEntity[];

  @OneToOne(() => UserBonusEntity, (bonus) => bonus.user, {
    eager: true,
  })
  @JoinColumn()
  bonus: UserBonusEntity;

  @OneToMany(() => EventRewardRaffleEntity, (eventRaffle) => eventRaffle.user)
  eventRaffles: EventRewardRaffleEntity[];

  @OneToMany(() => LoginOtpEntity, (loginOtp) => loginOtp.user)
  loginOtp: LoginOtpEntity[];
}
