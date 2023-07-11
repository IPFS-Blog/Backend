import { ApiProperty } from "@nestjs/swagger";

export class PatchUserLikeCommentNotFoundError {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "404",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "string",
    description: "錯誤訊息",
    example: "沒有此文章或留言",
  })
  public readonly error: string;

  @ApiProperty({
    type: "string",
    description: "呼叫 API 路徑",
    example: "/api/v1/articles/2/comment/3/likeStatus?userLike=false",
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
