import { ApiProperty } from "@nestjs/swagger";

export class CreateSubscribeResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 201,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "創建成功回應",
    example: "新增訂閱成功。",
  })
  public readonly message: string;
}
