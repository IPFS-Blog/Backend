import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CommentDto {
  @ApiProperty({
    description: "某文章的留言訊息",
    example: "我是第一篇文章的留言",
  })
  @IsNotEmpty({
    message: "contents 為必填欄位。",
  })
  public readonly contents: string;
}

export class CreateCommentDto extends PickType(CommentDto, [
  "contents",
] as const) {}
