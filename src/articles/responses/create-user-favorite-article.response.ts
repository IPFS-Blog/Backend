import { ApiProperty } from "@nestjs/swagger";

export class CreateUserFavoriteArticleResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 201,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "新增成功回應",
    example: "新增收藏成功。",
  })
  public readonly message: string;
}
