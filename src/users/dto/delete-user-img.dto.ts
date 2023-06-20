import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

enum Type {
  picture = "picture",
  background = "background",
}

export class DeleteUserImgDto {
  @ApiProperty({
    enum: Type,
    enumName: "DeleteType",
    example: Type.picture,
    description: "刪除類型",
  })
  @IsEnum(Type)
  public readonly type: string;
}
