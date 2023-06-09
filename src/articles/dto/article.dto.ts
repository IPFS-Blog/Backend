import { ApiProperty, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ArticleDto {
  @ApiProperty({
    example: "1",
    description: "文章的 ID",
  })
  @IsNotEmpty({
    message: "id 為必填欄位。",
  })
  public readonly id: string;

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
    message: "subtitle 為必填欄位。",
  })
  public readonly subtitle: string;

  @ApiProperty({
    description: "文章標題內文",
    example: "我是第一篇文章的內文",
  })
  @IsNotEmpty({
    message: "contents 為必填欄位。",
  })
  public readonly contents: string;
}

export class CreateArticleDto extends OmitType(ArticleDto, ["id"] as const) {}

export class DeleteArticleDto extends PickType(ArticleDto, ["id"] as const) {}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
