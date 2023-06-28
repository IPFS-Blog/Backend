import { ApiProperty } from "@nestjs/swagger";

export class ReleaseArticleRespose {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "200",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "發佈成功回應",
    example: "發佈成功",
  })
  public readonly message: string;
}
