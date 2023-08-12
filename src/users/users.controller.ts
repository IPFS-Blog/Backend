import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  SelectUserArticleAmountDto,
  SelectUserOwnArticleDto,
} from "./dto/select-user-article.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserBadRequestError } from "./exceptions/create-user-badrequest-error.exception";
import { DeleteUserImgBadRequestError } from "./exceptions/delete-user-img-badrequest-error.exception";
import { DeleteUserImgUnauthorizedError } from "./exceptions/delete-user-img-unauthorized-error.exception";
import { SelectAddressNotFoundError } from "./exceptions/select-address-notfound-error.exception";
import { SelectUnauthorizedError } from "./exceptions/select-unauthorized-error.exception";
import { SelectUserArticleBadRequestError } from "./exceptions/select-user-article-badrequest-error.exception";
import { SelectUserOwnArticleBadRequestError } from "./exceptions/select-user-own-article-badrequest-error.exception";
import { SelectUsernameArticleNotFoundError } from "./exceptions/select-username-article-notfound-error.exception";
import { SelectUsernameNotFoundError } from "./exceptions/select-username-notfound-error.exception";
import { UpdateUserBadRequestError } from "./exceptions/update-user-badrequest-error.exception";
import { UpdateUserDataUnauthorizedError } from "./exceptions/update-userdata-unauthorized-error.exception";
import { CreateUserResponse } from "./responses/create-user.response";
import { DeleteUserImgResponse } from "./responses/delete-user-img-response";
import { SelectUserResponse } from "./responses/select-user.response";
import { SelectUserArticleResponse } from "./responses/select-user-article.response";
import { SelectUsernameResponse } from "./responses/select-username.response";
import { UpdateUserResponse } from "./responses/update-user.response";
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
    type: CreateUserResponse,
  })
  @ApiBadRequestResponse({
    description: "創建失敗",
    type: CreateUserBadRequestError,
  })
  @HttpCode(HttpStatus.CREATED)
  metaMaskCreate(@Body() metaMaskDto: CreateUserDto) {
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
    type: SelectUserResponse,
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
    type: SelectUsernameResponse,
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
    type: SelectUserArticleResponse,
  })
  @ApiBadRequestResponse({
    description: "查詢失敗， 欄位格式驗證失敗",
    type: SelectUserArticleBadRequestError,
  })
  @ApiNotFoundResponse({
    description: "搜尋使用者失敗",
    type: SelectUsernameArticleNotFoundError,
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
    return this.usersService.findUserArticle(user, release, queryDto.skip);
  }

  @Get("/own/article")
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
    type: DeleteUserImgResponse,
  })
  @ApiBadRequestResponse({
    description: "類型不能為空。  \n" + "類型只能為 picture 或 background。",
    type: DeleteUserImgBadRequestError,
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
    type: UpdateUserResponse,
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
