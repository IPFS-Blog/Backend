import { ApiProperty } from "@nestjs/swagger";

export class SelectUserRespose {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "200",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "User 資料",
    items: {
      properties: {
        id: {
          description: "使用者 ID。  \n",
          type: "string",
        },
        username: {
          description: "使用者 名稱。  \n",
          type: "string",
        },
        address: {
          description: "使用者 錢包地址。  \n",
          type: "string",
        },
        email: {
          description: "使用者 信箱。  \n",
          type: "string",
        },
        picture: {
          description: "使用者 大頭貼。  \n",
          type: "string",
        },
        background: {
          description: "使用者 背景圖片。  \n",
          type: null,
        },
      },
    },
    example: {
      id: 1,
      username: "Jhon",
      address: "0x264D6BF791f6Be6F001A95e895AE0a904732d473",
      email: "jhon@gmail.com",
      picture: "https://i.imgur.com/Rkrp9tt.jpg",
      background: null,
    },
  })
  public readonly userData: string[];
}
