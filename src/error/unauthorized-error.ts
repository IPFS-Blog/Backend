import { ApiProperty } from "@nestjs/swagger";

export class UnauthorizedError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "401",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "錯誤訊息",
    example: "Unauthorized",
  })
  public readonly error: string;
}
