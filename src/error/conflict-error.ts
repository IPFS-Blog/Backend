import { ApiProperty } from "@nestjs/swagger";

export class ConflictError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 409,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "錯誤訊息",
    example: ["錯誤訊息"],
  })
  public readonly error: string[];
}
