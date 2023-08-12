import { ApiProperty } from "@nestjs/swagger";

export class GenerateNonceResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 201,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "產生 nonce",
    example: "17844f25-307c-4fff-be0a-26265b7104c6",
  })
  public readonly nonce: string;
}
