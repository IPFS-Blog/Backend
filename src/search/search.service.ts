import { HttpStatus, Injectable } from "@nestjs/common";
import { ArticlesService } from "src/articles/articles.service";
import { UsersService } from "src/users/users.service";

import { SelectUserOrArticleSearchDto } from "./dto/select-user-or-article-search.dto";

@Injectable()
export class SearchService {
  constructor(
    private readonly userService: UsersService,
    private readonly articleService: ArticlesService,
  ) {}
  async searchUserOrArticle(dto: SelectUserOrArticleSearchDto) {
    let user = {};
    let article = {};
    if (!dto.search_type) {
      user = await this.userService.fuzzySearchUserName(dto.query);
      article = await this.articleService.fuzzySearchArticle(dto.query);
    } else if (dto.search_type == "user") {
      user = await this.userService.fuzzySearchUserName(dto.query);
    } else if (dto.search_type == "title") {
      article = await this.articleService.fuzzySearchArticle(dto.query);
    }
    return {
      statusCode: HttpStatus.OK,
      users: user,
      articles: article,
    };
  }
}
