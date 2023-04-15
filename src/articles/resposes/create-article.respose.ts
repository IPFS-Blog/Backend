import { ApiProperty } from "@nestjs/swagger";

export class CreateArticleRespose {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "201",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "number",
    description: "修改成功回應",
    example: "修改成功",
  })
  public readonly message: string;
}
