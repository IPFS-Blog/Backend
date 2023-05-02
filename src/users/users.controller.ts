import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { ParseIntPipe } from "src/pipes/parse-int/parse-int.pipe";

import { CreateUserDto } from "./dto/create-user.dto";
import { PatchUserImgDto } from "./dto/patch-user-img.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserError } from "./exceptions/create-error.exception";
import { SelectAddressNotFoundError } from "./exceptions/select-address-notfound-error.exception";
import { SelectUnauthorizedError } from "./exceptions/select-unauthorized-error.exception";
import { SelectUserArticleBadrequestError } from "./exceptions/select-user-article-badrequest-error.exception";
import { SelectUserArticleNotAcceptableError } from "./exceptions/select-user-article-notacceptable-error.exception";
import { SelectUsernameNotFoundError } from "./exceptions/select-username-notfound-error.exception";
import { UpdateEntityError } from "./exceptions/update-entity-error.exception";
import { UpdateNotFoundError } from "./exceptions/update-notfound-error.exception";
import { UpdateUnauthorizedError } from "./exceptions/update-unauthorized-error.exception";
import { SelectUserRespose } from "./respose/select-user.respose";
import { SelectUserArticleRespose } from "./respose/select-user-article.respose";
import { SelectUsernameRespose } from "./respose/select-username.respose";
import { UpdateUserRespose } from "./respose/update-user.respose";
import { UsersService } from "./users.service";

@ApiTags("User")
@Controller("users")
@UsePipes(
  new ValidationPipe({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    stopAtFirstError: false,
    disableErrorMessages: false,
    whitelist: true,
  }),
)
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
  @ApiUnprocessableEntityResponse({
    description: "創建失敗",
    type: CreateUserError,
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
  @ApiParam({ name: "username", example: "Jhon" })
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
    description: "查詢失敗，輸入不可為負數",
    type: SelectUserArticleBadrequestError,
  })
  @ApiNotAcceptableResponse({
    description: "查詢失敗，欄位型態不對",
    type: SelectUserArticleNotAcceptableError,
  })
  @ApiParam({ name: "username", example: "Jhon" })
  @ApiQuery({ name: "skip", required: false })
  findArticleByUsername(
    @Param("username") username: string,
    @Query("skip", ParseIntPipe)
    skip: number,
  ) {
    return this.usersService.findUserArticle(username, skip);
  }
  @Patch("/img")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateImg(@Request() req, @Body() img: PatchUserImgDto) {
    return this.usersService.updateImg(req.user.id, img);
  }

  @Patch()
  @ApiOperation({
    summary: "更改自身使用者資料",
    description: "必須使用 JWT Token 及自身 address 來更改資料",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: "修改使用者資料成功",
    type: UpdateUserRespose,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UpdateUnauthorizedError,
  })
  @ApiNotFoundResponse({
    description: "沒有這使用者",
    type: UpdateNotFoundError,
  })
  @ApiUnprocessableEntityResponse({
    description: "修改使用者資料失敗",
    type: UpdateEntityError,
  })
  @HttpCode(HttpStatus.CREATED)
  updateOne(@Request() req, @Body() userDto: UpdateUserDto) {
    return this.usersService.updateOne(req.user.address, userDto);
  }
}
