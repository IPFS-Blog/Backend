import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
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
import { BadRequestError } from "src/error/bad-request-error";
import { ForbiddenError } from "src/error/forbidden-error";
import { NotFoundError } from "src/error/notfound-error";
import { ServiceUnavailableError } from "src/error/service-unavailable-error";
import { UnauthorizedError } from "src/error/unauthorized-error";
import { ParseIntPipe } from "src/pipes/parse-int/parse-int.pipe";
import { UsersService } from "src/users/users.service";

import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import {
  SelectUserArticleAmountDto,
  SelectUserOwnAidArticleDto,
  SelectUserOwnArticleDto,
} from "./dto/select-user-article.dto";
import { UserLikeDto } from "./dto/user-like.dto";
import { CreateArticleResponse } from "./responses/create-article.response";
import { DeleteArticleResponse } from "./responses/delete-article.response";
import { PatchUserLikeArticleResponse } from "./responses/patch-user-like-article.response";
import { ReleaseArticleResponse } from "./responses/release-article.response";
import { SelectAllArticleResponse } from "./responses/select-all-article.response";
import { SelectOneArticleResponse } from "./responses/select-one-article.response";
import { SelectOneOwnArticleResponse } from "./responses/select-one-own-article.response";
import { SelectUserArticleResponse } from "./responses/select-user-article.response";
import { UpdateArticleResponse } from "./responses/update-article.response";

@ApiTags("Article")
@Controller("articles")
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly usersService: UsersService,
  ) {}

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
    type: ServiceUnavailableError,
  })
  create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(req.user.id, createArticleDto);
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
  @ApiServiceUnavailableResponse({
    description: "IPFS 節點故障無回應",
    type: ServiceUnavailableError,
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
  @ApiServiceUnavailableResponse({
    description: "IPFS 節點故障無回應",
    type: ServiceUnavailableError,
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
    @Query() likeDto: UserLikeDto,
  ) {
    return this.articlesService.articleLikeStatus(
      req.user.id,
      +aid,
      likeDto.userLike,
    );
  }

  @Get("users/:username")
  @ApiOperation({
    summary: "搜尋特定使用者的文章",
    description: "預設固定都是10筆，預設從0開始",
  })
  @ApiOkResponse({
    description: "查詢成功",
    type: SelectUserArticleResponse,
  })
  @ApiBadRequestResponse({
    description: "資料格式驗證不對",
    type: BadRequestError,
  })
  @ApiNotFoundResponse({
    description: "搜尋使用者失敗",
    type: NotFoundError,
  })
  @ApiParam({
    name: "username",
    example: "Jhon",
    description: "使用者名稱",
  })
  async findArticleByUsername(
    @Param("username") username: string,
    @Query() queryDto: SelectUserArticleAmountDto,
  ) {
    const release = true;
    const user = await this.usersService.findByUsername(username);
    if (user === null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "無此使用者。",
      });
    }
    return this.articlesService.findUserArticle(user, release, queryDto.skip);
  }

  @Get("/user/own")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "搜尋使用者自身的文章",
    description:
      "預設固定都是10筆，預設從0開始  \n" +
      "1、true 是發佈  \n" +
      "0、false 是未發佈  \n",
  })
  @ApiOkResponse({
    description: "查詢成功",
    type: SelectUserArticleResponse,
  })
  @ApiBadRequestResponse({
    description: "資料格式驗證不對",
    type: BadRequestError,
  })
  async findOwnArticle(
    @Request() req,
    @Query() queryDto: SelectUserOwnArticleDto,
  ) {
    const user = await this.usersService.findUser(req.user.id);
    return this.articlesService.findUserArticle(
      user,
      queryDto.release,
      queryDto.skip,
    );
  }
}
