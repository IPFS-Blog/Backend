import { ApiProperty } from "@nestjs/swagger";

export class SelectUsernameArticleNotFoundError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "404",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "錯誤訊息",
    example: "無此使用者。",
  })
  public readonly error: string;

  @ApiProperty({
    type: "string",
    description: "呼叫 API 路徑",
    example: "/api/v1/users/Jhon12/articles",
  })
  public readonly path: string;

  @ApiProperty({
    type: "string",
    description: "HTTP 請求",
    example: "GET",
  })
  public readonly method: string;

  @ApiProperty({
    type: "string",
    description: "當下時間",
    example: "2023-03-24T16:04:47.263Z",
  })
  public readonly timeStamp: string;
}