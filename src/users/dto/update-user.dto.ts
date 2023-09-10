import { IntersectionType, PartialType } from "@nestjs/swagger";

import { PatchUserImgDto } from "./patch-user-img.dto";
import { UpdateUserDataDto } from "./update-user-data.dto";

export class UpdateUserDto extends PartialType(
  IntersectionType(UpdateUserDataDto, PatchUserImgDto),
) {}
