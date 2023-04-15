import { ForbiddenException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

import { CreateArticleDto } from "./dto/create-article.dto";
import { Article } from "./entities/article.entity";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private repository: Repository<Article>,
  ) {}
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

  async findAll() {
    const articles = await this.repository.find({
      where: {
        release: true,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      articles: articles,
    };
  }

  async findOne(id: number) {
    const article = await this.repository
      .createQueryBuilder("article")
      .leftJoin("article.user", "user")
      .where("article.id = :id", { id: id })
      .addSelect(["user.id", "user.username", "user.email", "user.address"])
      .getOne();
    if (!article.release) {
      throw new ForbiddenException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此文章。",
      });
    }
    return article;
  }
}
