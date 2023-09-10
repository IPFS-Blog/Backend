import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./user.entity";

@Entity({ name: "subscribes" })
export class Subscribe extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.followerId, {
    nullable: false,
  })
  @JoinColumn({ name: "followerId" })
  followerId: User;

  @ManyToOne(() => User, user => user.authorId, {
    nullable: false,
  })
  @JoinColumn({ name: "authorId" })
  authorId: User;
}
