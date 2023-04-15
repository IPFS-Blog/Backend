import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";

import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { CreateUnauthorizedError } from "./exceptions/create-unauthorized-error.exception";
import { CreateArticleRespose } from "./resposes/create-article.respose";
import { SelectAllArticleRespose } from "./resposes/select-all-article.respose";
import { SelectOneArticleRespose } from "./resposes/select-one-article.respose";

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

  @Get()
  @ApiOperation({
    summary: "搜尋所有文章",
    description: "將所有文章 只要是 release 是 1 都秀出來",
  })
  @ApiOkResponse({
    description: "搜尋成功",
    type: SelectAllArticleRespose,
  })
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(":id")
  @ApiParam({ name: "id", example: "1" })
  @ApiOperation({
    summary: "搜尋指定文章",
    description: "將指定文章秀出，但 release 得是 1 ",
  })
  @ApiOkResponse({
    description: "搜尋成功",
    type: SelectOneArticleRespose,
  })
  findOne(@Param("id") id: string) {
    return this.articlesService.findOne(+id);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Request() req, @Param("id") id: string) {
    return this.articlesService.remove(req.user.id, +id);
  }
}
