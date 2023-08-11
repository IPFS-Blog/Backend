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
} from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { GenerateNonceDto, LoginDto } from "./dto/auth-address-dto";
import { AuthConfirmDto } from "./dto/auth-confirm-dto";
import { CheckNotFoundError } from "./exceptions/check-notfound-error.exception";
import { GenerateNonceError } from "./exceptions/generate-nonce-error.exception";
import { GenerateTokenError } from "./exceptions/generate-token-error.exception";
import { GenerateNonceRespose } from "./respose/generate-nonce.respose";
import { GenerateTokenRespose } from "./respose/generate-token.respose";
import { verifyEmailResponse } from "./respose/verify-email.response";

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
    type: GenerateNonceRespose,
  })
  @ApiNotFoundResponse({
    description: "無此使用者",
    type: CheckNotFoundError,
  })
  @ApiBadRequestResponse({
    description: "資料格式不對",
    type: GenerateNonceError,
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
    type: GenerateTokenRespose,
  })
  @ApiForbiddenResponse({
    description: "身份驗證錯誤",
    type: GenerateTokenError,
  })
  async metaMasklogin(@Body() MetaMaskDto: LoginDto) {
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
  @ApiBadRequestResponse({ description: "資料格式不對" })
  @ApiNotFoundResponse({ description: "找不到使用者" })
  @ApiForbiddenResponse({ description: "驗證碼錯誤" })
  async emailAccountConfirm(@Body() dto: AuthConfirmDto) {
    return this.authService.emailAccountConfirm(dto);
  }
}
