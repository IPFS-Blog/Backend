import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class SelectUserCommentDto {
  @ApiPropertyOptional({
    description: "可選，cid 輸入會變成搜尋指定文章的留言",
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "無法解析為數字" })
  public readonly cid: number;
}

export class SelectUserOwnAidArticleDto extends PickType(SelectUserCommentDto, [
  "cid",
] as const) {}
