import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 201,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "創建成功回應",
    example: "創建成功",
  })
  public readonly message: string;
}
