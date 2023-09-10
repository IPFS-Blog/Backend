import { ApiProperty } from "@nestjs/swagger";

export class VerifyEmailResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 200,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "驗證成功回應",
    example: "驗證成功",
  })
  public readonly message: string;
}
