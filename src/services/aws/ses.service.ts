import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';

import { REFERRAL_POINTS } from '@config/constant';
import { CantSendEmailException } from '@exceptions/cant-send-email';

@Injectable()
export class SesService {
  constructor(private readonly configService: ConfigService) {}

  getSES() {
    return new SES({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION') || 'us-east-2',
      signatureVersion: 'v4',
    });
  }

  async sendFirstTimeOtpCodeEmail(code: string, email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@harpoonrewardsclub.com',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `<p>Hi there,</p>

<p>You’re in! Welcome to the Fiero Heat Seekers. </p>

<p>Your login code is ${code} </p>

<p>Fiero Heat Seekers members have exclusive access to swag, event tickets, VIP access, and fun rewards.</p>

<p>It’s easy to get started:</p>

<ul>
  <li><strong>Earn</strong> Fiero points at <a href="http://fierotequila.com/loyalty">[fierotequila.com/loyalty]</a> by completing challenges: responding to surveys, sharing photos, voting on new flavors, inviting friends, and more!</li>

  <li><strong>Redeem</strong> your Fiero points at <a href="http://fierotequila.com/loyalty">[fierotequila.com/loyalty]</a> for fun rewards: swag, event tickets, VIP access, and personalized products and experiences.</li>
</ul>

<p>You can check out your points total any time on your profile. And keep an eye on your inbox for special drops and time-limited sweepstakes and contests!</p>

<p>We can’t wait to raise a glass together.</p>

<p>Cheers,</p>

<p>Fiero Tequila</p>

<p><em>Please drink responsibly!</em></p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Your login code is ${code}. Welcome to the Fiero Heat Seekers!`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendFirstTimeGoogleAuthCodeEmail(email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@harpoonrewardsclub.com',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `<p>Hi there,</p>

<p>You’re in! Welcome to the Fiero Heat Seekers. </p>

<p>Fiero Heat Seekers members have exclusive access to swag, event tickets, VIP access, and fun rewards.</p>

<p>It’s easy to get started:</p>

<ul>
  <li><strong>Earn</strong> Fiero points at <a href="http://fierotequila.com/loyalty">[fierotequila.com/loyalty]</a> by completing challenges: responding to surveys, sharing photos, voting on new flavors, inviting friends, and more!</li>

  <li><strong>Redeem</strong> your Fiero points at <a href="http://fierotequila.com/loyalty">[fierotequila.com/loyalty]</a> for fun rewards: swag, event tickets, VIP access, and personalized products and experiences.</li>
</ul>

<p>You can check out your points total any time on your profile. And keep an eye on your inbox for special drops and time-limited sweepstakes and contests!</p>

<p>We can’t wait to raise a glass together.</p>

<p>Cheers,</p>

<p>Fiero Tequila</p>

<p><em>Please drink responsibly!</em></p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Welcome to the Fiero Heat Seekers!`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendOtpCodeEmail(code: string, email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@harpoonrewardsclub.com',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `
<p>Hi there,</p>

<p>${code} is your login code for the Fiero Heat Seekers. Let’s raise a glass together!</p>

<p>Cheers,</p>

<p>Fiero Tequila</p>

<p><em>Please drink responsibly!</em></p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `${code} is your login code for the Fiero Heat Seekers`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendVisaGiftCardClaimedEmail(email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@harpoonrewardsclub.com',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `
<p>Hey ${email}</p>

<p>Thanks for posting your first video through Drumbeat! We are reviewing your submission and will approve it asap. </p>

<p>You will get an email when your submission is approved with your gift card information. Please reach out to <a href="mailto:no-reply@harpoonrewardsclub.com">no-reply@harpoonrewardsclub.com</a> if you have not received anything within 72 hours (make sure to check your spam folder). </p>

<p>Yeehaw,</p>

<p style="margin-bottom: 0px;">Hannah & Hugh</p>
<p style="margin-top: 0px;"><em>Co-founders, Drumbeat</em>  🥁</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `🥳 $10 Visa Gift Card Pending (Just hold tight while we review)`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendVisaGiftCardApprovedEmail(
    gitCardCode: string,
    email: string,
    name = '',
  ): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@harpoonrewardsclub.com',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `
<p>Hey ${name && name.length > 0 ? name : email}</p>

<p>We appreciate your patience, below is the code to redeem your $10 Visa gift card. </p>

<p>${gitCardCode}</p>

<p><strong><b>Win even more prizes by entering Drumbeat’s contest challenges.</b></strong> Every week you can post videos for each of the challenges for more tickets to enter the big prize giveaway. Each giveaway has a random drawing for $1,000 AND we choose one winner for ‘Viral Choice Award’ to win a separate $1,000 in Visa gift cards.</p>

<p>Anyone eligible can win! See <a href="https://www.drumbeat.fun/rules">contest rules</a> for more details. </p>

<p>We’re grateful for you,</p>

<p style="margin-bottom: 0px;">Hannah & Hugh</p>
<p style="margin-top: 0px;"><em>Co-founders, Drumbeat</em>  🥁</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Your first prize: $10 Visa gift card 🎉`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendReferralEmail(email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@harpoonrewardsclub.com',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `<p>Hey there,</p>

<p>You’ve been invited to join the Fiero Tequila Heat Seekers by a friend!</p>

<p>The Heat Seekers is the community & rewards platform for Fiero Tequila, the spiciest tequila in the US.</p>

<p>Fiero Heat Seekers have exclusive access to swag, event tickets, VIP access, and fun rewards.</p>

<p>When you sign up, we’ll drop you and the friend that referred you an extra ${REFERRAL_POINTS} points!</p>

<p>It’s easy to get started:</p>

<ul>
  <li><strong>Sign up</strong> with your email address at <a href="http://fierotequila.com/loyalty">[fierotequila.com/loyalty]</a></li>

  <li><strong>Earn</strong> Fiero points by completing challenges: responding to surveys, sharing photos, voting on new flavors, inviting friends, and more!</li>

  <li><strong>Redeem</strong> your Fiero points for fun rewards: swag, event tickets, VIP access, and personalized products and experiences.</li>
</ul>

<p>You can check out your points total any time on your profile. And keep an eye on your inbox for special drops and time-limited sweepstakes and contests!</p>

<p>We can’t wait to raise a glass together.</p>

<p>Cheers,</p>

<p>Fiero Tequila</p>

<p><em>Please drink responsibly!</em></p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Fiero Tequila Rewards: You've been invited by a friend!`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendEmailToReferee(email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@harpoonrewardsclub.com',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `<p>Hey there,</p>

<p>Looks like you’ve been heating things up! One of your friends just joined the Fiero Heat Seekers using your personal referral link.</p>

<p>You’ve earned an extra ${REFERRAL_POINTS} Fiero points. Log in now at <a href="http://fierotequila.com/loyalty">fierotequila.com/loyalty</a> to start spending!</p>

<p>Cheers,</p>

<p>Fiero Tequila</p>

<p><em>Please drink responsibly!</em></p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `You've earned points! Your friend just joined the Fiero Heat Seekers through your personal referral link`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendRewardEmail(code: string, email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@harpoonrewardsclub.com',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `
              <p>Congratulations on redeeming your tokens to access your reward! </p>

              <p>Your code is:</p>
              
              <p>${code}</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Congratulations!`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }

  async sendReadyForClaimEmail(username: string, email: string): Promise<void> {
    try {
      const ses = this.getSES();

      const params = {
        Source: 'no-reply@harpoonrewardsclub.com',
        Destination: {
          ToAddresses: [email],
        },
        ReplyToAddresses: [],
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `<p>Hey ${username},</p>

<p>Thanks for completing a TikTok challenge via Drumbeat! We've verified your submission and you can now get entered to win big cash prizes.</p>

<p>Head back to drumbeat.fun to claim your tickets 🙌</p>

<p>Please reach out to no-reply@harpoonrewardsclub.com if you have questions.</p>

<p>Cheers, </p>

<p>Hannah & Hugh<br />Co-founders, Drumbeat 🥁</p>`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Drumbeat: TikTok submission verified! 🎉`,
          },
        },
      };

      const result = await ses.sendEmail(params).promise();
      console.log(result);
    } catch (err) {
      console.log(err);
      throw new CantSendEmailException();
    }
  }
}
