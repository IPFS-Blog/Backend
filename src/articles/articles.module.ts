import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IpfsModule } from "src/ipfs/ipfs.module";
import { MailModule } from "src/mail/mail.module";
import { FavoriteArticles } from "src/users/entities/favorite.entity";
import { User } from "src/users/entities/user.entity";
import { UsersModule } from "src/users/users.module";

import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";
import { CommentsModule } from "./comments/comments.module";
import { Article } from "./entities/article.entity";
import { Comment } from "./entities/comment.entity";

@Module({
  imports: [
    HttpModule,
    IpfsModule,
    UsersModule,
    TypeOrmModule.forFeature([Article, Comment, User, FavoriteArticles]),
    CommentsModule,
    MailModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
