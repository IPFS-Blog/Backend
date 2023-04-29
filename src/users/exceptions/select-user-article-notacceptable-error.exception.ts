import { ApiProperty } from "@nestjs/swagger";

export class SelectUserArticleNotAcceptableError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "406",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "錯誤訊息",
    items: {
      properties: {
        address: {
          description: "無法解析為數字。  \n",
          type: "string",
        },
      },
    },
    example: "無法解析為數字。",
  })
  public readonly error: string;

  @ApiProperty({
    type: "string",
    description: "呼叫 API 路徑",
    example: "/users/Jhon/articles?skip=//",
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
