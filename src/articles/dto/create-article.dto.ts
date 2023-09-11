import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreateArticleDto {
  @ApiProperty({
    description: "文章標題",
    example: "我是第一篇文章",
  })
  @IsNotEmpty({
    message: "title 為必填欄位。",
  })
  @Length(1, 255, { message: "title 長度只能 1-255 個字元。" })
  public readonly title: string;

  @ApiProperty({
    description: "文章副標題",
    example: "我是第一篇文章的副標題",
  })
  @IsNotEmpty({
    message: "subtitle 為必填欄位。",
  })
  @Length(1, 255, { message: "subtitle 長度只能 1-255 個字元。" })
  public readonly subtitle: string;

  @ApiProperty({
    description: "文章標題內文",
    example: "我是第一篇文章的內文",
  })
  @IsNotEmpty({
    message: "contents 為必填欄位。",
  })
  public readonly contents: string;

  @ApiPropertyOptional({
    description:
      "文章發佈狀態  \n" + "1、true 是發佈  \n" + "0、false 是未發佈  \n",
    example: true,
  })
  @Transform(({ value }) => {
    return [true, "true", 1, "1"].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean({
    message: "無法解析為 Boolean",
  })
  public readonly release: boolean = false;
}
