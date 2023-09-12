import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { appendFile } from "fs-extra";
import { join } from "path";
import { CreateFeedbackDto } from "src/feedback/dto/create-feedback.dto";
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
      const mailUserName = this.configService.get("group.email");
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
      subject: "基於IPFS區塊鏈的去中心化文章創作平台 帳號申請",
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
          `[${time}][Register] Email sent to ${user.email} successfully.\n`,
          "utf8",
        );
      })
      .catch(error => {
        appendFile(
          join(__dirname, "../../../", "logs/sendEmail.log"),
          `[${time}][Register] Email sent to ${user.email} Fail！！Need to check the email config. ${error} \n`,
          "utf8",
        );
        throw new ServiceUnavailableException({
          statusCode: 503,
          message: "信件寄送失敗，這可能是暫時的。",
          errorDetails: `[${time}][Register] Email sent to ${user.email} Fail！！Need to check the email config. ${error}`,
        });
      });
  }

  /**
   *
   * @param user 使用者實體
   * @param type 發布類型
   * 0 創建
   * 1 更新
   * 2 刪除
   * 3 發佈
   * 4 創建並發佈
   * 5 更新並發佈
   * @param aid 文章 ID
   */
  async sendArticleNotify(user: User, type: number, aid: number) {
    const nowDate = new Date();
    const status = ["創建", "更新", "刪除", "發佈", "創建並發佈", "更新並發佈"];
    const mailData = {
      to: user.email,
      subject: "基於IPFS區塊鏈的去中心化文章創作平台 文章狀態變更",
      template: "article-notify",
      context: {
        username: user.username,
        status: status[type],
        aid: aid,
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
          `[${time}][${type}][aid: ${aid}] Email sent to ${user.email} successfully.\n`,
          "utf8",
        );
      })
      .catch(error => {
        appendFile(
          join(__dirname, "../../../", "logs/sendEmail.log"),
          `[${time}][${type}][${aid}] Email sent to ${user.email} Fail！！Need to check the email config. ${error} \n`,
          "utf8",
        );
        throw new ServiceUnavailableException({
          statusCode: 503,
          message: "信件寄送失敗，這可能是暫時的。",
          errorDetails: `[${time}][${type}][${aid}] Email sent to ${user.email} Fail！！Need to check the email config. ${error}`,
        });
      });
  }

  async sendFeedBackToUser(
    feedback: CreateFeedbackDto,
    typeDescription: string,
  ) {
    const nowDate = new Date();
    const mailData = {
      to: feedback.email,
      subject: "基於IPFS區塊鏈的去中心化文章創作平台 問題回報",
      template: "email-feedback-user",
      context: {
        email: feedback.email,
        nickName: feedback.nickName,
        title: feedback.title,
        contents: feedback.contents,
        type: typeDescription,
        date: nowDate,
      },
    };
    const time = new Date().toString();
    await this.mailerService
      .sendMail(mailData)
      .then(() => {
        appendFile(
          join(__dirname, "../../../", "logs/sendEmail.log"),
          `[${time}][Feedback_User] Email sent to ${feedback.email} successfully.\n`,
          "utf8",
        );
      })
      .catch(error => {
        appendFile(
          join(__dirname, "../../../", "logs/sendEmail.log"),
          `[${time}][Feedback_User] Email sent to ${feedback.email} Fail！！Need to check the email config. ${error} \n`,
          "utf8",
        );
        throw new ServiceUnavailableException({
          statusCode: 503,
          message: "信件寄送失敗，這可能是暫時的。",
          errorDetails: `[${time}][Feedback_User] Email sent to ${feedback.email} Fail！！Need to check the email config. ${error}`,
        });
      });
  }

  async sendFeedBackToUs(feedback: CreateFeedbackDto, typeDescription: string) {
    const author_group = this.configService.get("group.email");
    const nowDate = new Date();
    const mailData = {
      to: author_group,
      subject: "基於IPFS區塊鏈的去中心化文章創作平台 問題回報",
      template: "email-feedback-us",
      context: {
        email: feedback.email,
        nickName: feedback.nickName,
        title: feedback.title,
        contents: feedback.contents,
        type: typeDescription,
        date: nowDate,
      },
    };
    const time = new Date().toString();
    await this.mailerService
      .sendMail(mailData)
      .then(() => {
        appendFile(
          join(__dirname, "../../../", "logs/sendEmail.log"),
          `[${time}][Feedback_Author] Email sent to ${feedback.email} successfully.\n`,
          "utf8",
        );
      })
      .catch(error => {
        appendFile(
          join(__dirname, "../../../", "logs/sendEmail.log"),
          `[${time}][Feedback_Author] Email sent to ${feedback.email} Fail！！Need to check the email config. ${error} \n`,
          "utf8",
        );
        throw new ServiceUnavailableException({
          statusCode: 503,
          message: "信件寄送失敗，這可能是暫時的。",
          errorDetails: `[${time}][Feedback_Author] Email sent to ${feedback.email} Fail！！Need to check the email config. ${error}`,
        });
      });
  }
}
