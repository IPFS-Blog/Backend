import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { BadRequestError } from "src/error/bad-request-error";
import { ForbiddenError } from "src/error/forbidden-error";
import { NotFoundError } from "src/error/notfound-error";
import { UnprocessableEntityError } from "src/error/unprocessable-entity-error";

import { AuthService } from "./auth.service";
import { GenerateNonceDto, LoginDto } from "./dto/auth-address-dto";
import { AuthConfirmDto } from "./dto/auth-confirm-dto";
import { GenerateNonceResponse } from "./responses/generate-nonce.response";
import { GenerateTokenResponse } from "./responses/generate-token.response";
import { verifyEmailResponse } from "./responses/verify-email.response";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.CREATED)
  @Get("/login/:address")
  @ApiOperation({
    summary: "確認使用者",
    description: "拿取 nonce 來簽證確認本人",
  })
  @ApiCreatedResponse({
    description: "產生 nonce",
    type: GenerateNonceResponse,
  })
  @ApiNotFoundResponse({
    description: "無此使用者",
    type: NotFoundError,
  })
  @ApiBadRequestResponse({
    description: "資料格式不對",
    type: BadRequestError,
  })
  async generateNonce(@Param() MetaMaskDto: GenerateNonceDto) {
    return this.authService.generateNonce(MetaMaskDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("/login")
  @ApiOperation({
    summary: "登入驗證",
    description: "使用已nonce簽證加密過得 signature 來確認本人",
  })
  @ApiCreatedResponse({
    description: "產生 token",
    type: GenerateTokenResponse,
  })
  @ApiBadRequestResponse({
    description: "資料格式不對",
    type: BadRequestError,
  })
  @ApiForbiddenResponse({
    description: "信箱未驗證",
    type: ForbiddenError,
  })
  @ApiUnprocessableEntityResponse({
    description: "未經授權",
    type: UnprocessableEntityError,
  })
  @ApiNotFoundResponse({
    description: "無此使用者",
    type: NotFoundError,
  })
  async metaMaskLogin(@Body() MetaMaskDto: LoginDto) {
    return this.authService.generateToken(MetaMaskDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/confirm")
  @ApiOperation({
    summary: "信箱驗證",
    description: "透過信箱獲取的驗證碼與信箱進行驗證",
  })
  @ApiOkResponse({
    description: "驗證成功",
    type: verifyEmailResponse,
  })
  @ApiBadRequestResponse({
    description: "資料格式不對",
    type: BadRequestError,
  })
  @ApiNotFoundResponse({
    description: "無此使用者",
    type: NotFoundError,
  })
  @ApiForbiddenResponse({
    description: "驗證碼錯誤",
    type: ForbiddenError,
  })
  async emailAccountConfirm(@Body() dto: AuthConfirmDto) {
    return this.authService.emailAccountConfirm(dto);
  }
}
