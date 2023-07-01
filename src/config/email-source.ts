import { ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailerAsyncOptions } from "@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface";
import { join } from "path";

export const emailSourceOption: MailerAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get("mail.host"),
      secure: false,
      auth: {
        user: configService.get("mail.username"),
        pass: configService.get("mail.password"),
      },
    },
    defaults: {
      from: `"基於IPFS區塊鏈的去中心化文章創作平台" <${configService.get(
        "mail.username",
      )}>`,
    },
    template: {
      dir: join("templates"),
      adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService],
};
