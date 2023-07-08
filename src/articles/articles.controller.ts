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
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { ParseIntPipe } from "src/pipes/parse-int/parse-int.pipe";
import { SelectUserOwnAidArticleDto } from "src/users/dto/select-user-article.dto";

import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UserLikeDto } from "./dto/user-like.dto";
import { CreateArticleUnauthorizedError } from "./exceptions/create-article-unauthorized-error.exception";
import { CreateCommentNotAcceptableError } from "./exceptions/create-comment-notacceptable-error.exception";
import { CreateCommentNotFoundError } from "./exceptions/create-comment-notfound-error.exception";
import { CreateCommentUnauthorizedError } from "./exceptions/create-comment-unauthorized-error.exception";
import { DeleteForbiddenError } from "./exceptions/delete-forbidden-error.exception";
import { DeleteNotFoundError } from "./exceptions/delete-notfound-error.exception";
import { DeleteUnauthorizedError } from "./exceptions/delete-unauthorized-error.exception";
import { ReleaseForbiddenError } from "./exceptions/release-forbidden-error.exception";
import { ReleaseNotFoundError } from "./exceptions/release-notfound-error.exception";
import { SelectNotFoundError } from "./exceptions/select-notfound-error.exception";
import { SelectOneOwnForbiddenError } from "./exceptions/select-one-own-forbidden-error.exception";
import { SelectOneOwnNotFoundError } from "./exceptions/select-one-own-notfound-error.exception";
import { SelectOneOwnUnauthorizedError } from "./exceptions/select-one-own-unauthorized-error.exception";
import { UpdateArticleUnauthorizedError } from "./exceptions/update-article-unauthorized-error.exception";
import { UpdateCommentForbiddenError } from "./exceptions/update-comment-forbidden-error.exception";
import { UpdateCommentUnauthorizedError } from "./exceptions/update-comment-unauthorized-error.exception";
import { CreateArticleRespose } from "./resposes/create-article.respose";
import { CreateCommentRespose } from "./resposes/create-comment.respose";
import { DeleteArticleRespose } from "./resposes/delete-article.respose";
import { ReleaseArticleRespose } from "./resposes/release-article.respose";
import { SelectAllArticleRespose } from "./resposes/select-all-article.respose";
import { SelectOneArticleRespose } from "./resposes/select-one-article.respose";
import { SelectOneOwnArticleRespose } from "./resposes/select-one-own-article.respose";
import { UpdateArticleRespose } from "./resposes/update-article.respose";
import { UpdateCommentRespose } from "./resposes/update-comment.respose";

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
    type: ReleaseArticleRespose,
  })
  @ApiCreatedResponse({
    description: "創建成功",
    type: CreateArticleRespose,
  })
  @ApiUnauthorizedResponse({
    description: "身份驗證錯誤",
    type: CreateArticleUnauthorizedError,
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
    type: SelectAllArticleRespose,
  })
  @ApiCreatedResponse({
    description:
      "搜尋成功，搜尋指定  \n" + "API 是 200，只是不能重複只好佔用 201  \n",
    type: SelectOneArticleRespose,
  })
  @ApiNotFoundResponse({
    description: "搜尋失敗",
    type: SelectNotFoundError,
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
    example: "1",
    description: "文章ID",
  })
  @ApiOkResponse({
    description: "搜尋成功",
    type: SelectOneOwnArticleRespose,
  })
  @ApiNotFoundResponse({
    description: "搜尋失敗",
    type: SelectOneOwnNotFoundError,
  })
  @ApiUnauthorizedResponse({
    description: "身份驗證錯誤",
    type: SelectOneOwnUnauthorizedError,
  })
  @ApiForbiddenResponse({
    description: "沒有權限",
    type: SelectOneOwnForbiddenError,
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
    example: "1",
    description: "文章ID",
  })
  @ApiOkResponse({
    description: "修改成功",
    type: UpdateArticleRespose,
  })
  @ApiCreatedResponse({
    description: "發佈成功  \n" + "API 是 200，只是不能重複只好佔用 201  \n",
    type: ReleaseArticleRespose,
  })
  @ApiUnauthorizedResponse({
    description: "身份驗證錯誤",
    type: UpdateArticleUnauthorizedError,
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
    example: "1",
    description: "文章ID",
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
    example: "1",
    description: "文章ID",
  })
  @ApiOkResponse({
    description: "發佈成功",
    type: ReleaseArticleRespose,
  })
  @ApiForbiddenResponse({
    description: "沒有權限",
    type: ReleaseForbiddenError,
  })
  @ApiNotFoundResponse({
    description: "沒有此文章",
    type: ReleaseNotFoundError,
  })
  release(@Request() req, @Param("aid", ParseIntPipe) aid: number) {
    return this.articlesService.release(req.user.id, +aid);
  }

  @Patch(":aid/likeStatus")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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

  @Post(":aid/comment")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "新增指定文章的留言",
    description:
      "新增指定文章的留言，透過JWT來驗證是否本人  \n" + "id 為文章id",
  })
  @ApiParam({
    name: "aid",
    type: "number",
    example: "1",
    description: "文章ID",
  })
  @ApiCreatedResponse({
    description: "創建成功",
    type: CreateCommentRespose,
  })
  @ApiUnauthorizedResponse({
    description: "身份驗證錯誤",
    type: CreateCommentUnauthorizedError,
  })
  @ApiNotFoundResponse({
    description: "沒有此文章",
    type: CreateCommentNotFoundError,
  })
  @ApiNotAcceptableResponse({
    description: "格式不正確",
    type: CreateCommentNotAcceptableError,
  })
  addComment(
    @Request() req,
    @Param("aid", ParseIntPipe) aid: number,
    @Body() ccdto: CreateCommentDto,
  ) {
    return this.articlesService.addComment(req.user.id, +aid, ccdto);
  }

  @Patch(":aid/comment/:cid")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "修改留言",
    description:
      "需要 JWT 驗證  \n" +
      "會驗證文章與留言是否存在  \n" +
      "驗證是否是自己的留言",
  })
  @ApiParam({
    name: "aid",
    type: "number",
    example: "1",
    description: "文章ID",
  })
  @ApiParam({
    name: "cid",
    type: "number",
    example: "1",
    description: "留言ID",
  })
  @ApiOkResponse({
    description: "修改成功",
    type: UpdateCommentRespose,
  })
  @ApiUnauthorizedResponse({
    description: "身份驗證錯誤",
    type: UpdateCommentUnauthorizedError,
  })
  @ApiForbiddenResponse({
    description: "沒有權限",
    type: UpdateCommentForbiddenError,
  })
  editComment(
    @Request() req,
    @Param("aid", ParseIntPipe) aid: number,
    @Param("cid", ParseIntPipe) cid: number,
    @Body() ccdto: CreateCommentDto,
  ) {
    return this.articlesService.editComment(req.user.id, +aid, +cid, ccdto);
  }

  @Delete(":aid/comment/:cid")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "刪除指定文章的一條留言刪除",
    description: "將指定文章的一條留言刪除，透過JWT來驗證是否本人 ",
  })
  @ApiParam({
    name: "aid",
    type: "number",
    example: "1",
    description: "文章ID",
  })
  @ApiParam({
    name: "cid",
    type: "number",
    example: "1",
    description: "留言ID",
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
  commentRemove(
    @Request() req,
    @Param("aid", ParseIntPipe) aid: number,
    @Param("cid", ParseIntPipe) cid: number,
  ) {
    return this.articlesService.delComment(req.user.id, +aid, +cid);
  }
}
