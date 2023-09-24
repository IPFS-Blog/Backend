import { Module } from "@nestjs/common";
import { ArticlesModule } from "src/articles/articles.module";
import { UsersModule } from "src/users/users.module";

import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
  imports: [UsersModule, ArticlesModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
