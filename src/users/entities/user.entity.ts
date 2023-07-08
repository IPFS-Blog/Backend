import { Article } from "src/articles/entities/article.entity";
import { Comment } from "src/articles/entities/comment.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  address: string;

  @Column({
    nullable: true,
    default: () => "NULL",
  })
  nonce: string;

  @Column({
    nullable: true,
    default: () => "NULL",
  })
  picture: string;

  @Column({
    nullable: true,
    default: () => "NULL",
  })
  background: string;

  @OneToMany(() => Article, article => article.user, {
    cascade: true,
  })
  articles: Article[];

  @OneToMany(() => Comment, comment => comment.id, {
    cascade: true,
  })
  comments: Comment[];

  @ManyToMany(() => Article, user => user.userLikes)
  @JoinTable({ name: "users_like_articles" })
  likeArticles: Article[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
