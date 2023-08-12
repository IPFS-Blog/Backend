import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { emailSourceOption } from "src/config/email-source";

import { MailService } from "./mail.service";

@Module({
  imports: [MailerModule.forRootAsync(emailSourceOption)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
