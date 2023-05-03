import { ApiProperty } from "@nestjs/swagger";

export class PatchImgError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "422",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "錯誤訊息",
    items: {
      properties: {
        address: {
          description: "picture 是一段 URL。  \n",
          type: "string",
        },
      },
    },
    example: ["picture 是一段 URL。"],
  })
  public readonly error: string[];

  @ApiProperty({
    type: "string",
    description: "呼叫 API 路徑",
    example: "/users/img",
  })
  public readonly path: string;

  @ApiProperty({
    type: "string",
    description: "HTTP 請求",
    example: "PATCH",
  })
  public readonly method: string;

  @ApiProperty({
    type: "string",
    description: "當下時間",
    example: "2023-03-24T16:04:47.263Z",
  })
  public readonly timeStamp: string;
}
