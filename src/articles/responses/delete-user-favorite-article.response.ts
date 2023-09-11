import { ApiProperty } from "@nestjs/swagger";

export class DeleteUserFavoriteArticleResponse {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: 200,
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "刪除成功回應",
    example: "刪除收藏成功。",
  })
  public readonly message: string;
}
