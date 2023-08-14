import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { ForbiddenError } from "src/error/forbidden-error";
import { NotFoundError } from "src/error/notfound-error";
import { UnauthorizedError } from "src/error/unauthorized-error";
import { ParseIntPipe } from "src/pipes/parse-int/parse-int.pipe";
import { SelectUserOwnAidArticleDto } from "src/users/dto/select-user-article.dto";

import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UserLikeDto } from "./dto/user-like.dto";
import { CreateArticleResponse } from "./responses/create-article.response";
import { DeleteArticleResponse } from "./responses/delete-article.response";
import { PatchUserLikeArticleResponse } from "./responses/patch-user-like-article.response";
import { ReleaseArticleResponse } from "./responses/release-article.response";
import { SelectAllArticleResponse } from "./responses/select-all-article.response";
import { SelectOneArticleResponse } from "./responses/select-one-article.response";
import { SelectOneOwnArticleResponse } from "./responses/select-one-own-article.response";
import { UpdateArticleResponse } from "./responses/update-article.response";

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
  @ApiOkResponse({
    description: "發佈成功",
    type: ReleaseArticleResponse,
  })
  @ApiCreatedResponse({
    description: "創建成功",
    type: CreateArticleResponse,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  @ApiServiceUnavailableResponse({
    description: "IPFS 節點故障無回應",
    type: UnauthorizedError,
  })
  create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(req.user.address, createArticleDto);
  }

  @Get()
  @ApiOperation({
    summary: "搜尋所有或指定文章",
    description:
      "將所有文章 只要是 release 是 1 都秀出來  \n" +
      "透過參數將指定文章秀出，但 release 得是 1  \n",
  })
  @ApiOkResponse({
    description: "搜尋成功，搜尋全部",
    type: SelectAllArticleResponse,
  })
  @ApiCreatedResponse({
    description:
      "搜尋成功，搜尋指定  \n" + "API 是 200，只是不能重複只好佔用 201  \n",
    type: SelectOneArticleResponse,
  })
  @ApiNotFoundResponse({
    description: "搜尋失敗",
    type: NotFoundError,
  })
  findArticle(@Query() queryDto: SelectUserOwnAidArticleDto) {
    let artciles = {};
    if (queryDto.aid != undefined) {
      artciles = this.articlesService.findOne(+queryDto.aid);
    } else {
      artciles = this.articlesService.findAll();
    }
    return artciles;
  }

  @Get(":aid")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "獲取指定文章資料",
    description: "獲取文章資訊包括草稿，需要 JWT 驗證",
  })
  @ApiParam({
    name: "aid",
    type: "number",
    example: 1,
    description: "文章ID",
  })
  @ApiOkResponse({
    description: "搜尋成功",
    type: SelectOneOwnArticleResponse,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  @ApiForbiddenResponse({
    description: "沒有權限",
    type: ForbiddenError,
  })
  @ApiNotFoundResponse({
    description: "搜尋失敗",
    type: NotFoundError,
  })
  getOwnArticle(@Request() req, @Param("aid", ParseIntPipe) aid: number) {
    return this.articlesService.findOwnArticle(req.user.id, aid);
  }

  @Patch(":aid")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "修改文章",
    description: "將文章資訊修改存起來，需要 JWT 驗證",
  })
  @ApiParam({
    name: "aid",
    type: "number",
    example: 1,
    description: "文章ID",
  })
  @ApiOkResponse({
    description: "修改成功",
    type: UpdateArticleResponse,
  })
  @ApiCreatedResponse({
    description: "發佈成功  \n" + "API 是 200，只是不能重複只好佔用 201  \n",
    type: ReleaseArticleResponse,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  update(
    @Request() req,
    @Param("aid", ParseIntPipe) aid: number,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articlesService.update(req.user.id, +aid, createArticleDto);
  }

  @Delete(":aid")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "刪除指定文章",
    description: "將指定文章刪除，透過JWT來驗證是否本人 ",
  })
  @ApiParam({
    name: "aid",
    type: "number",
    example: 1,
    description: "文章ID",
  })
  @ApiOkResponse({
    description: "刪除成功",
    type: DeleteArticleResponse,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  @ApiForbiddenResponse({
    description: "沒有權限",
    type: ForbiddenError,
  })
  @ApiNotFoundResponse({
    description: "沒有此文章",
    type: NotFoundError,
  })
  remove(@Request() req, @Param("aid", ParseIntPipe) aid: number) {
    return this.articlesService.remove(req.user.id, +aid);
  }

  @Patch(":aid/release")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "發佈指定文章",
    description: "將指定文章發佈，透過JWT來驗證是否本人 ",
  })
  @ApiParam({
    name: "aid",
    type: "number",
    example: 1,
    description: "文章ID",
  })
  @ApiOkResponse({
    description: "發佈成功",
    type: ReleaseArticleResponse,
  })
  @ApiForbiddenResponse({
    description: "沒有權限",
    type: ForbiddenError,
  })
  @ApiNotFoundResponse({
    description: "沒有此文章",
    type: NotFoundError,
  })
  release(@Request() req, @Param("aid", ParseIntPipe) aid: number) {
    return this.articlesService.release(req.user.id, +aid);
  }

  @Patch(":aid/likeStatus")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "對文章按讚/取消讚",
    description: "將指定文章進行按讚/取消讚  \n",
  })
  @ApiParam({
    name: "aid",
    type: "number",
    example: 1,
    description: "文章ID",
  })
  @ApiOkResponse({
    description: "修改成功",
    type: PatchUserLikeArticleResponse,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  @ApiNotFoundResponse({
    description: "沒有此文章",
    type: NotFoundError,
  })
  articleLikeStatus(
    @Request() req,
    @Param("aid", ParseIntPipe) aid: number,
    @Query() likedto: UserLikeDto,
  ) {
    return this.articlesService.articleLikeStatus(
      req.user.id,
      +aid,
      likedto.userLike,
    );
  }
}
