import { ApiProperty } from "@nestjs/swagger";

export class DeleteUserImgBadrequestError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "400",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "錯誤訊息",
    example: "類型不能為空。",
  })
  public readonly error: string;

  @ApiProperty({
    type: "string",
    description: "呼叫 API 路徑",
    example: "/api/v1/users/img",
  })
  public readonly path: string;

  @ApiProperty({
    type: "string",
    description: "HTTP 請求",
    example: "DELETE",
  })
  public readonly method: string;

  @ApiProperty({
    type: "string",
    description: "當下時間",
    example: "2023-03-24T16:04:47.263Z",
  })
  public readonly timeStamp: string;
}
