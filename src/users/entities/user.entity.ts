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

import { FavoriteArticles } from "./favorite.entity";
import { Subscribe } from "./sub.entity";

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

  @Column()
  confirmCode: string;

  @Column({
    type: "tinyint",
    default: 0,
  })
  emailVerified: boolean;

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

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  // 獲取本人訂閱的創作者們
  @OneToMany(() => Subscribe, subscribe => subscribe.followerId, {
    cascade: true,
  })
  followerId: Subscribe[];

  // 獲取訂閱本人的使用者們
  @OneToMany(() => Subscribe, subscribe => subscribe.authorId, {
    cascade: true,
  })
  authorId: Subscribe[];

  @ManyToMany(() => Article, user => user.userLikes)
  @JoinTable({ name: "users_like_articles" })
  likeArticles: Article[];

  @ManyToMany(() => Comment, user => user.userLikes)
  @JoinTable({ name: "users_like_comments" })
  likeComments: Comment[];

  @OneToMany(() => FavoriteArticles, fav => fav.userId, {
    cascade: true,
  })
  favoriteArticles: FavoriteArticles[];
}
