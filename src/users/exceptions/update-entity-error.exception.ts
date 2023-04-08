import { ApiProperty } from "@nestjs/swagger";

export class UpdateEntityError {
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
          description:
            "此名稱已被註冊，請換使用者名稱。  \n" +
            "此信箱已被註冊，請換信箱註冊。  \n",
          type: "string",
        },
      },
    },
    example: "此名稱已被註冊，請換使用者名稱。",
  })
  public readonly error: string;

  @ApiProperty({
    type: "string",
    description: "呼叫 API 路徑",
    example: "/users/10000",
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
