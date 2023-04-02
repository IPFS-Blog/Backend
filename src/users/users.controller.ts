import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserError } from "./exceptions/create-error.exception";
import { SelectNotFoundError } from "./exceptions/select-notfound-error.exception";
import { UpdateNotFoundError } from "./exceptions/update-notfound-error.exception";
import { SelectUserRespose } from "./respose/select-user.respose";
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

  @Post("/register")
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

  @Get(":username")
  @ApiOkResponse({
    description: "搜尋使用者成功",
    type: SelectUserRespose,
  })
  @ApiNotFoundResponse({
    description: "搜尋使用者失敗",
    type: SelectNotFoundError,
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "username", example: "Jhon" })
  findOne(@Param("username") username: string) {
    return this.usersService.findOne(username);
  }

  @Patch(":id")
  @ApiOkResponse({
    description: "修改使用者資料成功",
    type: UpdateUserRespose,
  })
  @ApiNotFoundResponse({
    description: "修改使用者資料失敗",
    type: UpdateNotFoundError,
  })
  @HttpCode(HttpStatus.CREATED)
  updateOne(@Param("id") id: number, @Body() userDto: UpdateUserDto) {
    return this.usersService.updateOne(id, userDto);
  }
}
