import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

enum Type {
  user = "user",
  title = "title",
}
export class SelectUserOrArticleSearchDto {
  @ApiPropertyOptional({
    type: "string",
    description: "查詢關鍵字",
    example: "John",
  })
  @IsOptional()
  public readonly query: string;
  @ApiPropertyOptional({
    enum: Type,
    enumName: "SearchType",
    example: Type.user,
    description: "查詢類型",
  })
  @IsOptional()
  @IsEnum(Type)
  public readonly search_type: string;
}
