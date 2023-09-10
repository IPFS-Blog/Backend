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
  ApiConflictResponse,
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
import { BadRequestError } from "src/error/bad-request-error";
import { ConflictError } from "src/error/conflict-error";
import { NotFoundError } from "src/error/notfound-error";
import { UnauthorizedError } from "src/error/unauthorized-error";
import { ParseIntPipe } from "src/pipes/parse-int/parse-int.pipe";

import { DeleteUserImgDto } from "./dto/delete-user-img.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateSubscribeResponse } from "./responses/create-subscribe";
import { DeleteSubscribeResponse } from "./responses/delete-subscribe.response";
import { DeleteUserImgResponse } from "./responses/delete-user-img-response";
import { SelectGetSubscribeResponse } from "./responses/select-get-subscribe.response";
import { SelectUserResponse } from "./responses/select-user.response";
import { SelectUsernameResponse } from "./responses/select-username.response";
import { UpdateUserResponse } from "./responses/update-user.response";
import { UsersService } from "./users.service";

@ApiTags("User")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    type: UnauthorizedError,
  })
  @HttpCode(HttpStatus.OK)
  getUserData(@Request() req) {
    return this.usersService.getUserData(req.user.id);
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
    type: NotFoundError,
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: "username",
    example: "John",
    description: "使用者名稱",
  })
  findOneByUsername(@Param("username") username: string) {
    return this.usersService.findOneByUsername(username);
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
    type: BadRequestError,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
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
    type: UnauthorizedError,
  })
  @ApiBadRequestResponse({
    description: "資料格式驗證不對",
    type: BadRequestError,
  })
  @ApiConflictResponse({
    description: "資料重覆",
    type: ConflictError,
  })
  @HttpCode(HttpStatus.CREATED)
  updateOne(@Request() req, @Body() userDto: UpdateUserDto) {
    return this.usersService.updateOne(req.user.id, userDto);
  }

  @Post("/:uid/subscribers")
  @ApiOperation({
    summary: "新增訂閱指定使用者",
    description:
      "必須使用 JWT Token 來驗證使用者資料  \n" + "uid 為對方使用者 ID",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: "uid",
    type: "number",
    example: 1,
    description: "使用者 ID",
  })
  @ApiCreatedResponse({
    description: "新增訂閱成功",
    type: CreateSubscribeResponse,
  })
  @ApiNotFoundResponse({
    description: "作者不存在",
    type: NotFoundError,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  @ApiBadRequestResponse({
    description: "資料格式驗證不對",
    type: BadRequestError,
  })
  @ApiConflictResponse({
    description: "已訂閱過",
    type: ConflictError,
  })
  AddSubscribe(@Request() req, @Param("uid", ParseIntPipe) uid: number) {
    return this.usersService.addSubscribe(req.user.id, uid);
  }

  @Delete("/:uid/subscribers")
  @ApiOperation({
    summary: "取消訂閱指定使用者",
    description:
      "必須使用 JWT Token 來驗證使用者資料  \n" + "uid 為對方使用者 ID",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: "uid",
    type: "number",
    example: 1,
    description: "使用者 ID",
  })
  @ApiOkResponse({
    description: "取消訂閱成功",
    type: DeleteSubscribeResponse,
  })
  @ApiNotFoundResponse({
    description: "作者不存在",
    type: NotFoundError,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  @ApiBadRequestResponse({
    description: "資料格式驗證不對",
    type: BadRequestError,
  })
  @ApiConflictResponse({
    description: "未訂閱過",
    type: ConflictError,
  })
  deleteSubscribe(@Request() req, @Param("uid", ParseIntPipe) uid: number) {
    return this.usersService.deleteSubscribe(req.user.id, uid);
  }

  @Get("/own/subscribers")
  @ApiOperation({
    summary: "獲取本人訂閱的創作者們",
    description: "必須使用 JWT Token 來驗證使用者資料  \n",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: "獲取成功",
    type: SelectGetSubscribeResponse,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  getSubscribe(@Request() req) {
    return this.usersService.getSubscribers(req.user.id);
  }

  @Get("/own/followers")
  @ApiOperation({
    summary: "獲取訂閱本人的使用者們",
    description: "必須使用 JWT Token 來驗證使用者資料  \n",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: "獲取成功",
    type: SelectGetSubscribeResponse,
  })
  @ApiUnauthorizedResponse({
    description: "未經授權",
    type: UnauthorizedError,
  })
  getFollower(@Request() req) {
    return this.usersService.getFollowers(req.user.id);
  }
}
