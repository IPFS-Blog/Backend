import { ApiProperty } from "@nestjs/swagger";

export class GenerateTokenRespose {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "201",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "產生 accesstoken",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWRkcmVzcyI6IjB4RUZhNEFiYWM3RmVkQjhGMDUxNGJlRTcyMTJkYzE5RDUyM0REMzA4OSIsImVtYWlsIjoiQW5keUBnbWFpbC5jb20iLCJpYXQiOjE2Nzk3NDM4NzUsImV4cCI6MTY3OTgzMDI3NX0.sm2aIH1SMIpEnEYlISxgt_VYyuNVnXI3sITA0oXrtCs",
  })
  public readonly accessToken: string;
}
