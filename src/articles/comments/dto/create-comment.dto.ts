import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    description: "某文章的留言訊息",
    example: "我是第一篇文章的留言",
  })
  @IsNotEmpty({
    message: "contents 為必填欄位。",
  })
  public readonly contents: string;
}
