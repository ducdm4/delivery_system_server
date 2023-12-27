import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailChangePassword(user: string) {
    await this.mailerService.sendMail({
      to: 'ducdm03016.dev@gmail.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'IMPORTANT: Password Changed',
      template: './changePasswordConfirm', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user,
        url: 'test.com',
      },
    });
  }

  async sendEmailCreateAccount(user: {
    name: string;
    mail: string;
    password: string;
  }) {
    await this.mailerService.sendMail({
      to: 'ducdm03016.dev@gmail.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Your account have been created',
      template: './notifyPasswordOnCreate', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        mail: user.mail,
        password: user.password,
      },
    });
  }

  async sendEmailOTPCancelOrder(OTP: number, trackingId: string) {
    await this.mailerService.sendMail({
      to: 'ducdm03016.dev@gmail.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: `Order ${trackingId} cancel OTP`,
      template: './sendOTPCancelOrder', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        otp: OTP,
        trackingId,
      },
    });
  }
}
