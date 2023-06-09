import { Article } from "src/articles/entities/article.entity";
import { User } from "src/users/entities/user.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "comments" })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @ManyToOne(() => User, user => user.id, {
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Article, article => article.comments, {
    nullable: false,
  })
  article: Article;

  @Column()
  likes: number;

  @Column({
    type: "longtext",
  })
  contents: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn({
    type: "datetime",
    comment: "刪除時間",
  })
  deletedAt: Date;
}
