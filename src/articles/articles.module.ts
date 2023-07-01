import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";
import { Article } from "./entities/article.entity";
import { Comment } from "./entities/comment.entity";
import { IpfsService } from "./ipfs.service";

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Article, Comment])],
  controllers: [ArticlesController],
  providers: [ArticlesService, IpfsService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
