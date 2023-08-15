import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { appendFile } from "fs-extra";
import { join } from "path";
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
      subject: "基於IPFS區塊鏈的去中心化文章創作平台 帳號申請 測試",
      template: "email-account-confirm",
      context: {
        username: user.username,
        confirmCode: user.confirmCode,
        date: nowDate,
        baseUrl: this.configService.get("app.host"),
      },
    };
    const time = new Date().toString();
    await this.mailerService
      .sendMail(mailData)
      .then(() => {
        appendFile(
          join(__dirname, "../../../", "logs/sendEmail.log"),
          `[${time}] Email sent to ${user.email} successfully.\n`,
          "utf8",
        );
      })
      .catch(error => {
        appendFile(
          join(__dirname, "../../../", "logs/sendEmail.log"),
          `[${time}] Email sent to ${user.email} Fail！！Need to check the email config. ${error} \n`,
          "utf8",
        );
        throw new ServiceUnavailableException({
          statusCode: 503,
          message: "信件寄送失敗，這可能是暫時的。",
          errorDetails: `[${time}] Email sent to ${user.email} Fail！！Need to check the email config. ${error}`,
        });
      });
  }
}
