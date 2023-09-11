import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Feedback } from "./feedback.entity";

@Entity({ name: "feedbacks_types" })
export class FeedbackType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @OneToMany(() => Feedback, feedback => feedback.type, {
    cascade: true,
  })
  feedback: Feedback[];
}
