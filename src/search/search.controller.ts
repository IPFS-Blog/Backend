import { Controller, Get, Query } from "@nestjs/common";

import { SelectUserOrArticleSearchDto } from "./dto/select-user-or-article-search.dto";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  searchUserOrArticle(@Query() dto: SelectUserOrArticleSearchDto) {
    return this.searchService.searchUserOrArticle(dto);
  }
}
