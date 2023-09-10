import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class PatchUserImgDto {
  @ApiProperty({
    description: "大頭貼",
    example: "https://i.imgur.com/Rkrp9tt.jpg",
  })
  @IsString({
    message: "picture 是一段 URL。",
  })
  @Length(1, 255, { message: "picture url 長度只能 1-255 個字元。" })
  public readonly picture: string;
  @ApiProperty({
    description: "背景圖",
    example: "https://i.imgur.com/AkInO9F.jpg",
  })
  @IsString({
    message: "background 是一段 URL。",
  })
  @Length(1, 255, { message: "background url 長度只能 1-255 個字元。" })
  public readonly background: string;
}
