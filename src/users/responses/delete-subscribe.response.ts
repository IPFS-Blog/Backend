import { ApiProperty } from "@nestjs/swagger";

export class DeleteSubscribeResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 200,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "取消成功回應",
    example: "取消訂閱成功。",
  })
  public readonly message: string;
}
