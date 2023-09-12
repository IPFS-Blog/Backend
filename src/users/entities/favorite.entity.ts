import { Article } from "src/articles/entities/article.entity";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./user.entity";

@Entity({ name: "users_favorite_articles" })
export class FavoriteArticles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.favoriteArticles, {
    nullable: false,
  })
  @JoinColumn({ name: "userId" })
  userId: User;

  @ManyToOne(() => Article, article => article.favoriteArticles, {
    nullable: false,
  })
  @JoinColumn({ name: "articleId" })
  articleId: Article;

  @CreateDateColumn()
  createAt: Date;
}
