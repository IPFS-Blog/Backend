import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber } from "class-validator";

const optionalBooleanMapper = new Map([
  ["undefined", undefined],
  ["true", true],
  ["1", true],
  ["false", false],
  ["0", false],
]);

export class SelectUserOwnArticleDto {
  @ApiProperty({
    description:
      "選擇文章發佈  \n" + "1、true 是發佈  \n" + "0、false 是未發佈  \n",
    example: true,
  })
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  @IsBoolean({
    message: "無法解析為 Boolean",
  })
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
