import { Body, Controller, Post } from "@nestjs/common";

import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackService } from "./feedback.service";

@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
  @Post("/")
  addFeedback(@Body() feedback: CreateFeedbackDto) {
    return this.feedbackService.addFeedback(feedback);
  }
}
