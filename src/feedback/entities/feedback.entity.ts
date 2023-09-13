import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { FeedbackType } from "./feedback-type.entity";

@Entity({ name: "feedbacks" })
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  nickName: string;

  @Column()
  title: string;

  @Column({
    type: "longtext",
  })
  contents: string;

  @ManyToOne(() => FeedbackType, type => type.feedback, {
    nullable: false,
  })
  type: FeedbackType;
}
