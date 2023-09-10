import { ApiProperty } from "@nestjs/swagger";

export class ForbiddenError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 403,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "錯誤訊息",
    example: "錯誤訊息",
  })
  public readonly error: string;
}
