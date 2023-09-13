import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "src/mail/mail.service";
import { Repository } from "typeorm";

import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { Feedback } from "./entities/feedback.entity";
import { FeedbackType } from "./entities/feedback-type.entity";

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(FeedbackType)
    private readonly feedbackTypeRepository: Repository<FeedbackType>,
    private mailService: MailService,
  ) {}
  async addFeedback(feedback: CreateFeedbackDto) {
    const type = await this.getFeedbackType(feedback.type);
    if (!type) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此問題類型。",
      });
    }
    const data = this.feedbackRepository.create({
      email: feedback.email,
      nickName: feedback.nickName,
      title: feedback.title,
      contents: feedback.contents,
      type: type,
    });
    await this.feedbackRepository.save(data);
    await this.mailService.sendFeedBackToUser(feedback, type.description);
    await this.mailService.sendFeedBackToUs(feedback, type.description);
    return {
      statusCode: HttpStatus.CREATED,
      message: "創建回饋成功",
    };
  }

  async getFeedbackType(id: number) {
    return await this.feedbackTypeRepository.findOneBy({ id: id });
  }
}
