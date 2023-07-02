import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { appendFile } from "fs-extra";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendAccountConfirm(userDto: CreateUserDto) {
    const code = Math.random().toString().slice(-6);
    const nowDate = new Date();
    const mailData = {
      to: userDto.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: "基於IPFS區塊鏈的去中心化文章創作平台 帳號申請 測試",
      template: "email-account-confirm",
      context: {
        // ✏️ filling curly brackets with content
        username: userDto.username,
        confirmCode: code,
        date: nowDate,
      },
    };
    await this.mailerService
      .sendMail(mailData)
      .then(() => {
        const time = new Date().toString();
        appendFile(
          "sendEmail.log",
          `[${time}] Email sent to ${userDto.email}`,
          "utf8",
          err => {
            const errorMessage = {
              statusCode: 500,
              message: `Failed to write file. ${err}`,
            };
            throw new InternalServerErrorException(errorMessage);
          },
        );
      })
      .catch(() => {
        const errorMessage = {
          statusCode: 500,
          message: `When sent to ${userDto.email}'s email sent fail！ Need to check the email config.`,
        };
        throw new InternalServerErrorException(errorMessage);
      });
  }
}
