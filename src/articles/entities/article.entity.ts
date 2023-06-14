import { User } from "src/users/entities/user.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Comment } from "./comment.entity";

@Entity({ name: "articles" })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column({
    type: "longtext",
  })
  contents: string;

  @Column({
    type: "tinyint",
    default: 0,
  })
  release: boolean;

  @Column()
  totalComments: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => User, user => user.id, {
    nullable: false,
  })
  user: User;

  @OneToMany(() => Comment, comment => comment.article, {
    cascade: true,
  })
  comments: Comment[];
}
