import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";

import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";

@ApiTags("Article")
@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(req.user.address, createArticleDto);
  }
}
