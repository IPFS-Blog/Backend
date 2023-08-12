import { ApiProperty } from "@nestjs/swagger";

export class UpdateArticleResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 200,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "修改成功回應",
    example: "修改成功",
  })
  public readonly message: string;
}
