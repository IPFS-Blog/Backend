import { ApiProperty } from "@nestjs/swagger";

export class DeleteUserImgRespose {
  @ApiProperty({
    type: "number",
    description: "HTTP 回應代碼",
    example: "200",
  })
  public readonly statusCode: number;

  @ApiProperty({
    type: "number",
    description: "刪除成功回應",
    example: "刪除成功",
  })
  public readonly message: string;
}