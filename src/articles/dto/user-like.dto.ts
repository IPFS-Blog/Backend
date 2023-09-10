import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class UserLikeDto {
  @ApiPropertyOptional({
    description:
      "按讚狀態  \n" + "1、true 是按讚  \n" + "0、false 是取消讚  \n",
    example: true,
  })
  @Transform(({ value }) => {
    return [true, "true", 1, "1"].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean({
    message: "無法解析為 Boolean",
  })
  public readonly userLike: boolean = false;
}
