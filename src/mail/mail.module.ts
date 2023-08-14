import {
  HttpStatus,
  Module,
  OnModuleInit,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { emailSourceOption } from "src/config/email-source";

import { MailService } from "./mail.service";

@Module({
  imports: [MailerModule.forRootAsync(emailSourceOption)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    const env = this.configService.get("app.env");
    if (env != "local") {
      const connectionStatus = await this.mailService.checkEmailConfiguration();
      if (!connectionStatus.connected) {
        throw new ServiceUnavailableException({
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: "寄信系統 故障無法寄信，請檢查設定。",
        });
      }
    }
  }
}
