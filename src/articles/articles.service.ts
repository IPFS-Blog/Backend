import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

import { CreateArticleDto } from "./dto/create-article.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Article } from "./entities/article.entity";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
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
    article.subtitle = ArtDto.subtitle;
    article.contents = ArtDto.contents;
    article.release = ArtDto.release;
    await article.save();
    return {
      statusCode: HttpStatus.CREATED,
      message: "創建成功",
    };
  }

  async findAll() {
    const articles = await this.articleRepository
      .createQueryBuilder("article")
      .leftJoin("article.user", "user")
      .where("article.release = :release", { release: true })
      .addSelect(["user.username", "user.picture"])
      .getMany();
    return {
      statusCode: HttpStatus.OK,
      articles: articles,
    };
  }

  async findOne(aid: number) {
    const article = await this.articleRepository
      .createQueryBuilder("article")
      .leftJoin("article.user", "user")
      .where("article.id = :aid", { aid })
      .addSelect([
        "user.id",
        "user.username",
        "user.email",
        "user.address",
        "user.picture",
      ])
      .leftJoin("article.comments", "comments")
      .addSelect([
        "comments.number",
        "comments.likes",
        "comments.contents",
        "comments.createAt",
        "comments.updateAt",
      ])
      .getOne();
    if (!article || !article.release) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此文章。",
      });
    }
    return {
      statusCode: HttpStatus.OK,
      article: article,
    };
  }

  async findArticlesByUsername(
    user: User,
    release: boolean,
    skip: number,
  ): Promise<Article[]> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder("article")
      .where("article.user.id = :id", { id: user.id })
      .andWhere("article.release = :release", { release: release })
      .select([
        "article.id",
        "article.title",
        "article.subtitle",
        "article.release",
        "article.createAt",
        "article.updateAt",
      ])
      .skip(skip)
      .take(10)
      .getMany();
    return queryBuilder;
  }
  async update(usrId: number, aid: number, ArtDto: CreateArticleDto) {
    const hasExist = await this.articleRepository.findOneBy({ id: aid });
    if (hasExist == null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此文章。",
      });
    }
    const article = await this.articleRepository.findOne({
      where: {
        id: aid,
      },
      relations: {
        user: true,
      },
    });
    if (usrId !== article.user.id) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: "沒有權限變更此文章",
      });
    }
    await this.articleRepository.update(article.id, ArtDto);
    return {
      statusCode: HttpStatus.OK,
      message: "修改成功",
    };
  }
  async remove(usrId: number, id: number) {
    const hasExist = await this.articleRepository.findOneBy({ id: id });
    if (hasExist == null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此文章。",
      });
    }
    const article = await this.articleRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        user: true,
      },
    });
    if (usrId !== article.user.id) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: "沒有權限刪除此文章",
      });
    }
    await this.articleRepository.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: "刪除成功",
    };
  }
  async release(usrId: number, aid: number) {
    const hasExist = await this.articleRepository.findOneBy({ id: aid });
    if (hasExist == null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此文章。",
      });
    }
    const article = await this.articleRepository.findOne({
      where: {
        id: aid,
      },
      relations: {
        user: true,
      },
    });
    if (usrId !== article.user.id) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: "沒有權限發佈此文章",
      });
    }
    await this.articleRepository.update(article.id, {
      release: true,
    });
    return {
      statusCode: HttpStatus.OK,
      message: "發佈成功",
    };
  }
  async addComment(userId: number, aid: number, ccdto: CreateCommentDto) {
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    const article = await Article.findOneBy({
      id: aid,
    });
    if (article == null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此文章。",
      });
    }
    const comment = new Comment();
    comment.number = article.totalComments + 1;
    comment.user = user;
    comment.article = article;
    comment.contents = ccdto.contents;
    await comment.save();
    await Article.update(aid, { totalComments: article.totalComments + 1 });
    return {
      statusCode: HttpStatus.CREATED,
      message: "創建成功",
    };
  }
  async editComment(
    userId: number,
    aid: number,
    cid: number,
    ccdto: CreateCommentDto,
  ) {
    const thisComment = await this.commentRepository
      .createQueryBuilder("comment")
      .where("comment.number = :cid", { cid })
      .leftJoinAndSelect("comment.article", "article")
      .andWhere("comment.article = :aid", { aid })
      .leftJoin("comment.user", "user")
      .addSelect(["user.id"])
      .getOne();
    if (thisComment == null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此留言。",
      });
    }
    if (userId !== thisComment.user.id) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: "沒有權限修改此流言",
      });
    }
    await this.commentRepository.update(thisComment.id, ccdto);
    return {
      statusCode: HttpStatus.OK,
      message: "修改成功",
    };
  }
  async delComment(userId: number, aid: number, cid: number) {
    const thisComment = await this.commentRepository
      .createQueryBuilder("comment")
      .where("comment.number = :cid", { cid })
      .leftJoinAndSelect("comment.article", "article")
      .andWhere("comment.article = :aid", { aid })
      .leftJoin("comment.user", "user")
      .addSelect(["user.id"])
      .getOne();
    if (thisComment == null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此留言。",
      });
    }
    if (userId !== thisComment.user.id) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: "沒有權限修改此流言",
      });
    }
    await this.commentRepository
      .createQueryBuilder("comments")
      .softDelete()
      .where("comments.id = :id", { id: thisComment.id })
      .execute();
    return {
      statusCode: HttpStatus.OK,
      message: "刪除成功",
    };
  }
}
