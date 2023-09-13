import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateFeedbackDto {
  @ApiProperty({
    description: "使用者信箱",
    example: "john@gmail.com",
  })
  @IsEmail({}, { message: "email 必須是信箱格式。" })
  @IsNotEmpty({
    message: "email 為必填欄位。",
  })
  @Length(1, 255, { message: "email 長度只能 1-255 個字元。" })
  public readonly email: string;

  @ApiProperty({
    description: "回饋問題的使用者暱稱",
    example: "John",
  })
  @IsNotEmpty({
    message: "nickName 為必填欄位。",
  })
  @Length(1, 255, { message: "nickName 長度只能 1-255 個字元。" })
  public readonly nickName: string;

  @ApiProperty({
    description: "回饋問題標題",
    example: "我是回饋問題的標題",
  })
  @IsNotEmpty({
    message: "title 為必填欄位。",
  })
  @Length(1, 255, { message: "title 長度只能 1-255 個字元。" })
  public readonly title: string;

  @ApiProperty({
    description: "回饋問題標題內文",
    example: "我是回饋問題的內文",
  })
  @IsNotEmpty({
    message: "contents 為必填欄位。",
  })
  public readonly contents: string;

  @ApiProperty({
    description: "回饋問題的種類",
    example: 1,
  })
  @IsNotEmpty({
    message: "type 為必填欄位。",
  })
  public readonly type: number;
}
