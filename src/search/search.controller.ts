import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { SelectUserOrArticleSearchDto } from "./dto/select-user-or-article-search.dto";
import { SelectUserOrArticleResponse } from "./responses/select-user-or-article.response";
import { SearchService } from "./search.service";

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({
    summary: "查詢關鍵詞",
    description: "是模糊搜尋，找尋使用者名或文章標題  \n" + "不填將會兩者都查",
  })
  @ApiOkResponse({
    type: SelectUserOrArticleResponse,
    description: "獲取文章資訊或使用者資料",
  })
  searchUserOrArticle(@Query() dto: SelectUserOrArticleSearchDto) {
    return this.searchService.searchUserOrArticle(dto);
  }
}
