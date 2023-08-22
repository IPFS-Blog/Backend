import { ApiProperty } from "@nestjs/swagger";

export class GenerateTokenResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 201,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "產生 accessToken",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRkcmVzcyI6IjB4RUZhNEFiYWM3RmVkQjhGMDUxNGJlRTcyMTJkYzE5RDUyM0REMzA4OSIsImVtYWlsIjoiQW5keUBnbWFpbC5jb20iLCJpYXQiOjE2Nzk3NDM4NzUsImV4cCI6MTY3OTgzMDI3NX0.sm2aIH1SMIpEnEYlISxgt_VYyuNVnXI3sITA0oXrtCs",
  })
  public readonly accessToken: string;

  @ApiProperty({
    type: "object",
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
          nullable: true,
        },
        background: {
          description: "使用者 背景圖片。  \n",
          type: "string",
          nullable: true,
        },
      },
    },
    example: {
      id: 1,
      username: "John",
      address: "0x264D6BF791f6Be6F001A95e895AE0a904732d473",
      email: "john@gmail.com",
      picture: "https://i.imgur.com/Rkrp9tt.jpg",
      background: null,
    },
  })
  public readonly userData: string[];
}
