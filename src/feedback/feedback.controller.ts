import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { NotFoundError } from "src/error/notfound-error";

import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackResponse } from "./responses/create-feedback-response";

@ApiTags("Feedback")
@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
  @Post("/")
  @ApiOperation({
    summary: "新增回饋問題",
    description: "type 類型  \n" + "1 是系統問題  \n" + "2 是改善回饋",
  })
  @ApiCreatedResponse({
    description: "創建回饋成功",
    type: CreateFeedbackResponse,
  })
  @ApiNotFoundResponse({
    description: "沒有此問題種類",
    type: NotFoundError,
  })
  addFeedback(@Body() feedback: CreateFeedbackDto) {
    return this.feedbackService.addFeedback(feedback);
  }
}
