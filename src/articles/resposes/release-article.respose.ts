import { ApiProperty } from "@nestjs/swagger";

export class ReleaseArticleRespose {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "200",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "IPFS Hash 碼",
    example: "QmUcbyZC8AoHFJ2x9WxTNEJNMDbPRn3rbLnaDiBB58vaxG",
  })
  public readonly ipfsHash: string;

  @ApiProperty({
    type: "number",
    description: "文章 ID 編號",
    example: 2,
  })
  public readonly aid: number;

  @ApiProperty({
    type: "string",
    description: "文章 創建時間",
    example: "2023-03-24T16:04:47.263Z",
  })
  public readonly createAt: string;

  @ApiProperty({
    type: "string",
    description: "文章 更新當下時間",
    example: "2023-07-01T05:39:45.000Z",
  })
  public readonly updateAt: string;

  @ApiProperty({
    type: "string",
    description: "發佈成功回應",
    example: "發佈成功",
  })
  public readonly message: string;
}
