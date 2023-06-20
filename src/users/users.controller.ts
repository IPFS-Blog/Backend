import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";

import { CreateUserDto } from "./dto/create-user.dto";
import { DeleteUserImgDto } from "./dto/delete-user-img.dto";
import {
  SelectUserArticleDto,
  SelectUserOwnArticleDto,
} from "./dto/select-user-article.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserBadRequestError } from "./exceptions/create-user-badrequest-error.exception";
import { DeleteUserImgBadrequestError } from "./exceptions/delete-user-img-badrequest-error.exception";
import { DeleteUserImgUnauthorizedError } from "./exceptions/delete-user-img-unauthorized-error.exception";
import { SelectAddressNotFoundError } from "./exceptions/select-address-notfound-error.exception";
import { SelectUnauthorizedError } from "./exceptions/select-unauthorized-error.exception";
import { SelectUserArticleBadrequestError } from "./exceptions/select-user-article-badrequest-error.exception";
import { SelectUserOwnArticleBadRequestError } from "./exceptions/select-user-own-article-badrequest-error.exception";
import { SelectUsernameNotFoundError } from "./exceptions/select-username-notfound-error.exception";
import { UpdateUserBadRequestError } from "./exceptions/update-user-badrequest-error.exception";
import { UpdateUserDataUnauthorizedError } from "./exceptions/update-userdata-unauthorized-error.exception";
import { DeleteUserImgRespose } from "./respose/delete-user-img-respose";
import { SelectUserRespose } from "./respose/select-user.respose";
import { SelectUserArticleRespose } from "./respose/select-user-article.respose";
import { SelectUsernameRespose } from "./respose/select-username.respose";
import { UpdateUserRespose } from "./respose/update-user.respose";
import { UsersService } from "./users.service";

@ApiTags("User")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/")
  @ApiOperation({
    summary: "使用者註冊",
    description: "會檢查是否重複過的資料",
  })
  @ApiCreatedResponse({
    description: "使用者創建成功",
  })
  @ApiBadRequestResponse({
    description: "創建失敗",
    type: CreateUserBadRequestError,
  })
  @HttpCode(HttpStatus.CREATED)
  metaMaskcreate(@Body() metaMaskDto: CreateUserDto) {
    return this.usersService.createByMetaMask(metaMaskDto);
  }

  @Get("/")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "獲取自身資料",
    description: "必須使用 JWT Token 來獲取資料",
  })
  @ApiOkResponse({
    description: "搜尋使用者成功",
    type: SelectUserRespose,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: SelectUnauthorizedError,
  })
  @ApiNotFoundResponse({
    description: "搜尋使用者失敗",
    type: SelectAddressNotFoundError,
  })
  @HttpCode(HttpStatus.OK)
  findOneByAddress(@Request() req) {
    return this.usersService.findOneByAddress(req.user.address);
  }

  @Get(":username")
  @ApiOperation({
    summary: "搜尋特定使用者",
    description: "會檢查是否存在，回傳使用者資料",
  })
  @ApiOkResponse({
    description: "搜尋使用者成功",
    type: SelectUsernameRespose,
  })
  @ApiNotFoundResponse({
    description: "搜尋使用者失敗",
    type: SelectUsernameNotFoundError,
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: "username",
    example: "Jhon",
    description: "使用者名稱",
  })
  findOneByUsername(@Param("username") username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @Get(":username/articles")
  @ApiOperation({
    summary: "搜尋特定使用者的文章",
    description: "預設固定都是10筆，預設從0開始",
  })
  @ApiOkResponse({
    description: "查詢成功",
    type: SelectUserArticleRespose,
  })
  @ApiBadRequestResponse({
    description: "查詢失敗， 欄位格式驗證失敗",
    type: SelectUserArticleBadrequestError,
  })
  @ApiParam({
    name: "username",
    example: "Jhon",
    description: "使用者名稱",
  })
  async findArticleByUsername(
    @Param("username") username: string,
    @Query() queryDto: SelectUserArticleDto,
  ) {
    const release = true;
    const user = await this.usersService.findByUsername(username);
    return this.usersService.findUserArticle(user, release, queryDto.skip);
  }

  @Get("/own/article")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "搜尋使用者自身的文章",
    description:
      "預設固定都是10筆，預設從0開始  \n" + "release 0 未發佈、1 發佈",
  })
  @ApiOkResponse({
    description: "查詢成功",
    type: SelectUserArticleRespose,
  })
  @ApiBadRequestResponse({
    description: "查詢失敗， 欄位格式驗證失敗",
    type: SelectUserOwnArticleBadRequestError,
  })
  async findOwnArticle(
    @Request() req,
    @Query() queryDto: SelectUserOwnArticleDto,
  ) {
    const user = await this.usersService.findUser(req.user.id);
    return this.usersService.findUserArticle(
      user,
      queryDto.release,
      queryDto.skip,
    );
  }

  @Delete("/img")
  @ApiOperation({
    summary: "刪除使用者圖片或背景圖片",
    description:
      "true是大頭貼、false是背景圖  \n" +
      "將指定使用者圖片類型刪除，透過JWT來驗證是否本人",
  })
  @ApiQuery({ type: DeleteUserImgDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: "刪除成功",
    type: DeleteUserImgRespose,
  })
  @ApiBadRequestResponse({
    description: "類型不能為空。  \n" + "類型只能為 picture 或 background。",
    type: DeleteUserImgBadrequestError,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: DeleteUserImgUnauthorizedError,
  })
  remove(@Request() req, @Query("type") type) {
    return this.usersService.deleteImg(req.user.id, type);
  }

  @Patch()
  @ApiOperation({
    summary: "更改自身使用者資料",
    description:
      "必須使用 JWT Token 來驗證使用者資料  \n" +
      "全部為可選，如果有填同使用者一樣的資料會忽略",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: "修改使用者資料成功",
    type: UpdateUserRespose,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UpdateUserDataUnauthorizedError,
  })
  @ApiBadRequestResponse({
    description: "修改使用者資料失敗",
    type: UpdateUserBadRequestError,
  })
  @HttpCode(HttpStatus.CREATED)
  updateOne(@Request() req, @Body() userDto: UpdateUserDto) {
    return this.usersService.updateOne(req.user.address, userDto);
  }
}
