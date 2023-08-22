import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "使用者錢包ID",
    example: "0x264D6BF791f6Be6F001A95e895AE0a904732d473",
    minLength: 42,
    maxLength: 42,
  })
  @IsNotEmpty({
    message: "address 為必填欄位。",
  })
  @Length(42, 42, { message: "address 長度只有 42 個字元。" })
  @IsString({
    message: "address 是一段字串。",
  })
  public readonly address: string;

  @ApiProperty({
    description: "使用者名稱",
    example: "John",
  })
  @IsNotEmpty({
    message: "username 為必填欄位。",
  })
  public readonly username: string;

  @ApiProperty({
    description: "使用者信箱",
    example: "john@gmail.com",
  })
  @IsEmail({}, { message: "email 必須是信箱格式。" })
  @IsNotEmpty({
    message: "email 為必填欄位。",
  })
  public readonly email: string;
}
