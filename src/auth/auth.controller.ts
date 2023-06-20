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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { GenerateNonceDto, LoginDto } from "./dto/auth-address-dto";
import { CheckNotFoundError } from "./exceptions/check-notfound-error.exception";
import { GenerateNonceError } from "./exceptions/generate-nonce-error.exception";
import { GenerateTokenError } from "./exceptions/generate-token-error.exception";
import { GenerateNonceRespose } from "./respose/generate-nonce.respose";
import { GenerateTokenRespose } from "./respose/generate-token.respose";

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
  @ApiUnprocessableEntityResponse({
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
}
