import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { emailSourceOption } from "src/config/email-source";

import { MailService } from "./mail.service";

@Module({
  imports: [ConfigModule, MailerModule.forRootAsync(emailSourceOption)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
