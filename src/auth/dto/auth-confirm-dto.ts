import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class AuthConfirmDto {
  @ApiProperty({
    description: "使用者信箱",
    example: "jhon@gmail.com",
  })
  @IsEmail({}, { message: "email 必須是信箱格式。" })
  @IsNotEmpty({
    message: "email 為必填欄位。",
  })
  public readonly email: string;

  @ApiProperty({
    required: true,
    description: "confirmCode email 驗證碼",
    example: "671317",
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty({
    message: "confirmCode 為必填欄位。",
  })
  @IsString({
    message: "confirmCode 是一段字串。",
  })
  @Length(6, 6, { message: "confirmCode 長度只有 6 個字元。" })
  public readonly confirmCode: string;
}
