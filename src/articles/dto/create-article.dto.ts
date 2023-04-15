import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateArticleDto {
  @ApiProperty({
    description: "文章標題",
    example: "我是第一篇文章",
  })
  @IsNotEmpty({
    message: "title 為必填欄位。",
  })
  public readonly title: string;
  @ApiProperty({
    description: "文章副標題",
    example: "我是第一篇文章的副標題",
  })
  @IsNotEmpty({
    message: "overview 為必填欄位。",
  })
  public readonly overview: string;
  @ApiProperty({
    description: "文章標題內文",
    example: "我是第一篇文章的內文",
  })
  @IsNotEmpty({
    message: "contents 為必填欄位。",
  })
  public readonly contents: string;
}
