import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

const optionalBooleanMapper = new Map([
  ["true", true],
  ["1", true],
  ["false", false],
  ["0", false],
]);

export class SelectUserOwnArticleDto {
  @ApiPropertyOptional({
    description:
      "選擇文章發佈  \n" +
      "1、true 是發佈  \n" +
      "0、false 是未發佈  \n" +
      "傳入其他的皆認定回傳全部  \n",
  })
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  public readonly release: boolean;

  @ApiPropertyOptional({
    description: "可選，skip 忽略前幾筆，未填則是 0",
    example: 0,
  })
  @Type(() => Number)
  @IsNumber({}, { message: "無法解析為數字" })
  public readonly skip: number = 0;
}

export class SelectUserArticleDto extends PickType(SelectUserOwnArticleDto, [
  "skip",
] as const) {}
