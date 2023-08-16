import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IpfsModule } from "src/ipfs/ipfs.module";
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
    TypeOrmModule.forFeature([Article, Comment]),
    CommentsModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
