import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as Sentry from "@sentry/node";
import * as fs from "fs";
import * as morgan from "morgan";
import { join } from "path";
import { SentryInterceptor } from "sentry/sentry.interceptor";

import { AppModule } from "./app.module";
import { Environment } from "./config/env.validation";
import { validationPipe } from "./pipes/validation-pipe";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(morgan("default", { stream: logStream }));
  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(validationPipe);

  app.useStaticAssets(join("outputs"), {
    prefix: "/outputs",
  });
  app.setBaseViewsDir(join("templates"));
  app.setViewEngine("hbs");

  let cors_settings = {};
  const white_list = process.env.CORS_WHITE.split(",");
  if (process.env.NODE_ENV !== Environment.Production) {
    setupSwagger(app);
  } else {
    cors_settings = {
      origin: white_list,
      methods: [process.env.CORS_METHOD],
      credentials: true,
    };
  }
  if (process.env.NODE_ENV !== Environment.Local) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    });
    app.useGlobalInterceptors(new SentryInterceptor());
  }

  app.enableCors(cors_settings);
  await app.listen(3000);
}

const logStream = fs.createWriteStream("api.log", {
  flags: "a", // append
});

function setupSwagger(app: INestApplication) {
  const builder = new DocumentBuilder();
  const config = builder
    .setTitle(process.env.APP_SWAGGER_Title)
    .setDescription(process.env.APP_SWAGGER_Description)
    .setVersion(process.env.APP_SWAGGER_Version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);
}

bootstrap();
