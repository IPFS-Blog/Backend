import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "src/mail/mail.module";

import { Feedback } from "./entities/feedback.entity";
import { FeedbackType } from "./entities/feedback-type.entity";
import { FeedbackController } from "./feedback.controller";
import { FeedbackService } from "./feedback.service";

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, FeedbackType]), MailModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
