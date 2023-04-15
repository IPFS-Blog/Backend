import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";

import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { CreateUnauthorizedError } from "./exceptions/create-unauthorized-error.exception";
import { CreateArticleRespose } from "./resposes/create-article.respose";

@ApiTags("Article")
@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "創建文章",
    description: "將文章資訊存起來，需要 JWT 驗證",
  })
  @ApiCreatedResponse({
    description: "創建成功",
    type: CreateArticleRespose,
  })
  @ApiUnauthorizedResponse({
    description: "身份驗證錯誤",
    type: CreateUnauthorizedError,
  })
  create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(req.user.address, createArticleDto);
  }
}
