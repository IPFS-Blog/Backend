import { ApiProperty } from "@nestjs/swagger";

export class GenerateTokenError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "400",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "Error Message",
    items: {
      properties: {
        address: {
          description:
            "address 為必填欄位。  \n" +
            "address 是一段字串。  \n" +
            "address 長度只有 42 個字元。  \n",
          type: "string",
        },
        signature: {
          description:
            "signature 為必填欄位。  \n" +
            "signature 是一段字串。  \n" +
            "signature 長度只有 132 個字元。  \n",
          type: "string",
        },
      },
    },
    example: [
      "address 為必填欄位。",
      "signature 為必填欄位。",
      "signature 長度只有 132 個字元。  \n",
    ],
  })
  public readonly error: string[];

  @ApiProperty({
    type: "string",
    description: "呼叫 API 路徑",
    example: "/api/v1/auth/login/0x264D6B71f6Be6F001A95e895AE0a904732d473",
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
