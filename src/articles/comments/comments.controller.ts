import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { BadRequestError } from "src/error/bad-request-error";
import { ForbiddenError } from "src/error/forbidden-error";
import { NotFoundError } from "src/error/notfound-error";
import { UnauthorizedError } from "src/error/unauthorized-error";

import { SelectUserOwnAidArticleDto } from "../dto/select-user-article.dto";
import { UserLikeDto } from "../dto/user-like.dto";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CreateCommentResponse } from "./responses/create-comment.response";
import { DeleteCommentResponse } from "./responses/delete-comment.response";
import { PatchUserLikeCommentResponse } from "./responses/patch-user-like-comment.response";
import { SelectLikeCommentResponse } from "./responses/select-like-comment.response";
import { UpdateCommentResponse } from "./responses/update-comment.response";

@ApiTags("Comment")
@Controller("articles")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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
    example: 1,
    description: "文章ID",
  })
  @ApiCreatedResponse({
    description: "創建成功",
    type: CreateCommentResponse,
  })
  @ApiBadRequestResponse({
    description: "資料格式驗證不對、路由不是數字",
    type: BadRequestError,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  @ApiNotFoundResponse({
    description: "沒有此文章",
    type: NotFoundError,
  })
  addComment(
    @Request() req,
    @Param("aid", ParseIntPipe) aid: number,
    @Body() ccDto: CreateCommentDto,
  ) {
    return this.commentsService.addComment(req.user.id, +aid, ccDto);
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
    example: 1,
    description: "文章ID",
  })
  @ApiParam({
    name: "cid",
    type: "number",
    example: 1,
    description: "留言ID",
  })
  @ApiOkResponse({
    description: "修改成功",
    type: UpdateCommentResponse,
  })
  @ApiBadRequestResponse({
    description: "資料格式驗證不對、路由不是數字",
    type: BadRequestError,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  @ApiForbiddenResponse({
    description: "沒有權限",
    type: ForbiddenError,
  })
  editComment(
    @Request() req,
    @Param("aid", ParseIntPipe) aid: number,
    @Param("cid", ParseIntPipe) cid: number,
    @Body() ccDto: CreateCommentDto,
  ) {
    return this.commentsService.editComment(req.user.id, +aid, +cid, ccDto);
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
    example: 1,
    description: "文章ID",
  })
  @ApiParam({
    name: "cid",
    type: "number",
    example: 1,
    description: "留言ID",
  })
  @ApiOkResponse({
    description: "刪除成功",
    type: DeleteCommentResponse,
  })
  @ApiBadRequestResponse({
    description: "資料格式驗證不對、路由不是數字",
    type: BadRequestError,
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
  commentRemove(
    @Request() req,
    @Param("aid", ParseIntPipe) aid: number,
    @Param("cid", ParseIntPipe) cid: number,
  ) {
    return this.commentsService.delComment(req.user.id, +aid, +cid);
  }

  @Patch(":aid/comment/:cid/likeStatus")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "對留言按讚/取消讚",
    description: "將指定文章的一條留言進行按讚/取消讚  \n",
  })
  @ApiParam({
    name: "aid",
    type: "number",
    example: 1,
    description: "文章ID",
  })
  @ApiParam({
    name: "cid",
    type: "number",
    example: 1,
    description: "留言ID",
  })
  @ApiOkResponse({
    description: "修改成功",
    type: PatchUserLikeCommentResponse,
  })
  @ApiBadRequestResponse({
    description: "資料格式驗證不對、路由不是數字",
    type: BadRequestError,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  @ApiNotFoundResponse({
    description: "沒有此文章或留言",
    type: NotFoundError,
  })
  commentLikeStatus(
    @Request() req,
    @Param("aid", ParseIntPipe) aid: number,
    @Param("cid", ParseIntPipe) cid: number,
    @Query() likeDto: UserLikeDto,
  ) {
    return this.commentsService.commentLikeStatus(
      req.user.id,
      +aid,
      +cid,
      likeDto.userLike,
    );
  }

  @Get("/user/comments/likes")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "搜尋使用者自身喜愛的留言",
    description: "aid 為可選，未填入則是全部",
  })
  @ApiOkResponse({
    description: "查詢成功",
    type: SelectLikeCommentResponse,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  getLikes(@Request() req, @Query() likeDto: SelectUserOwnAidArticleDto) {
    return this.commentsService.getLikedComments(+req.user.id, likeDto.aid);
  }
}
