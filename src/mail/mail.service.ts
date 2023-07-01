import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendAccountConfirm(userDto: CreateUserDto) {
    const code = Math.random().toString().slice(-6);
    const nowDate = new Date();
    await this.mailerService.sendMail({
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
    });
  }
}
