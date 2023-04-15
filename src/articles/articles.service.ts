import { HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";

import { CreateArticleDto } from "./dto/create-article.dto";
import { Article } from "./entities/article.entity";

@Injectable()
export class ArticlesService {
  async create(address: string, ArtDto: CreateArticleDto) {
    const user = await User.findOne({
      where: {
        address: address,
      },
    });
    const article = new Article();
    article.user = user;
    article.title = ArtDto.title;
    article.overview = ArtDto.overview;
    article.contents = ArtDto.contents;
    await article.save();
    return {
      statusCode: HttpStatus.CREATED,
      message: "創建成功",
    };
  }
}
