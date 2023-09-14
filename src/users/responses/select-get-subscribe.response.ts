import { ApiProperty } from "@nestjs/swagger";

export class SelectGetSubscribeResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 200,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "array",
    description: "創作者 資料",
    items: {
      properties: {
        id: {
          description: "使用者 ID。  \n",
          type: "number",
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
          nullable: true,
        },
      },
    },
    example: [
      {
        id: 2,
        username: "John1",
        email: "john1@gmail.com",
        address: "0x264D6BF791f6Be6F001A95e895AE0a904732d474",
        picture: "https://i.imgur.com/Rkrp9tt.jpg",
      },
      {
        id: 3,
        username: "1John",
        email: "1john@gmail.com",
        address: "0x264D6BF791f6Be6F001A95e895AE0a904732d475",
        picture: null,
      },
    ],
  })
  public readonly subscribers: string[];
}
