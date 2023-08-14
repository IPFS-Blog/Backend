import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { appendFile } from "fs-extra";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async checkEmailConfiguration() {
    try {
      const nowDate = new Date();
      const env = this.configService.get("app.env");
      const host = this.configService.get("app.host");
      const mailUserName = this.configService.get("mail.username");
      await this.mailerService.sendMail({
        to: mailUserName,
        subject: "Testing Nest MailerModule ✔",
        text: "welcome",
        html: `
        <h1>welcome</h1>
        <h3>ENV： ${env}</h3>
        <h3>HOST： ${host}</h3>
        <h3>Now Time：${nowDate}</h3>
        `,
      });

      return {
        connected: true,
        message: "Email configuration is valid.",
      };
    } catch (error) {
      return {
        connected: false,
        message: "Email configuration verification failed.",
      };
    }
  }
  async sendAccountConfirm(user: User) {
    const nowDate = new Date();
    const mailData = {
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: "基於IPFS區塊鏈的去中心化文章創作平台 帳號申請 測試",
      template: "email-account-confirm",
      context: {
        // ✏️ filling curly brackets with content
        username: user.username,
        confirmCode: user.confirmCode,
        date: nowDate,
        baseUrl: this.configService.get("app.host"),
      },
    };
    await this.mailerService
      .sendMail(mailData)
      .then(() => {
        const time = new Date().toString();
        appendFile(
          "sendEmail.log",
          `[${time}] Email sent to ${user.email}`,
          "utf8",
        );
      })
      .catch(error => {
        const errorMessage = {
          statusCode: 500,
          message: `When sent to ${user.email}'s email sent fail！ Need to check the email config. ${error}`,
        };
        throw new InternalServerErrorException(errorMessage);
      });
  }
}
