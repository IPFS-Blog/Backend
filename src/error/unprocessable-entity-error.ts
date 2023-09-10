import { ApiProperty } from "@nestjs/swagger";

export class UnprocessableEntityError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 422,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "錯誤訊息",
    example: "Unauthorized",
  })
  public readonly error: string;
}
