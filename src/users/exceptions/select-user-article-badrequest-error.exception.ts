import { ApiProperty } from "@nestjs/swagger";

export class SelectUserArticleBadrequestError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "400",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "錯誤訊息",
    items: {
      properties: {
        example: {
          description: "無法解析為數字  \n" + "輸入不可為負數。  \n",
          type: "string",
        },
      },
    },
    example: ["無法解析為數字"],
  })
  public readonly error: string[];

  @ApiProperty({
    type: "string",
    description: "呼叫 API 路徑",
    example: "/api/v1/users/Jhon/articles?skip=-1",
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
