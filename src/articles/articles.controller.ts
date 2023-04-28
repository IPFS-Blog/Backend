import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
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
import { DeleteForbiddenError } from "./exceptions/delete-forbidden-error.exception";
import { DeleteNotFoundError } from "./exceptions/delete-notfound-error.exception";
import { DeleteUnauthorizedError } from "./exceptions/delete-unauthorized-error.exception";
import { SelectNotFoundError } from "./exceptions/select-notfound-error.exception";
import { UpdateUnauthorizedError } from "./exceptions/update-unauthorized-error.exception";
import { CreateArticleRespose } from "./resposes/create-article.respose";
import { DeleteArticleRespose } from "./resposes/delete-article.respose";
import { SelectAllArticleRespose } from "./resposes/select-all-article.respose";
import { SelectOneArticleRespose } from "./resposes/select-one-article.respose";
import { UpdateArticleRespose } from "./resposes/update-article.respose";

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
  @ApiNotFoundResponse({
    description: "搜尋失敗",
    type: SelectNotFoundError,
  })
  findOne(@Param("id") id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "修改文章",
    description: "將文章資訊修改存起來，需要 JWT 驗證",
  })
  @ApiOkResponse({
    description: "修改成功",
    type: UpdateArticleRespose,
  })
  @ApiUnauthorizedResponse({
    description: "身份驗證錯誤",
    type: UpdateUnauthorizedError,
  })
  update(
    @Request() req,
    @Param("id") id: string,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articlesService.update(req.user.id, +id, createArticleDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "刪除指定文章",
    description: "將指定文章刪除，透過JWT來驗證是否本人 ",
  })
  @ApiOkResponse({
    description: "刪除成功",
    type: DeleteArticleRespose,
  })
  @ApiUnauthorizedResponse({
    description: "身份驗證錯誤",
    type: DeleteUnauthorizedError,
  })
  @ApiForbiddenResponse({
    description: "沒有權限",
    type: DeleteForbiddenError,
  })
  @ApiNotFoundResponse({
    description: "沒有此文章",
    type: DeleteNotFoundError,
  })
  remove(@Request() req, @Param("id") id: string) {
    return this.articlesService.remove(req.user.id, +id);
  }
}
