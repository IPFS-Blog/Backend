import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { existsSync, mkdirSync, readFile, writeFile } from "fs-extra";
import { compile } from "handlebars";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

import { CreateArticleDto } from "./dto/create-article.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Article } from "./entities/article.entity";
import { Comment } from "./entities/comment.entity";
import { IpfsService } from "./ipfs.service";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private ipfsService: IpfsService,
  ) {}

  async findAll() {
    const articles = await this.articleRepository
      .createQueryBuilder("article")
      .leftJoin("article.user", "user")
      .where("article.release = :release", { release: true })
      .select([
        "article.id",
        "article.title",
        "article.subtitle",
        "article.contents",
        "article.release",
        "article.totalComments",
        "article.ipfsHash",
        "article.createAt",
        "article.updateAt",
      ])
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
      .leftJoinAndSelect("article.comments", "comments")
      .leftJoinAndSelect("comments.user", "commentUser")
      .select([
        "article.id",
        "article.title",
        "article.subtitle",
        "article.contents",
        "article.release",
        "article.totalComments",
        "article.likes",
        "article.ipfsHash",
        "article.createAt",
        "article.updateAt",
      ])
      .addSelect([
        "user.id",
        "user.username",
        "user.email",
        "user.address",
        "user.picture",
      ])
      .addSelect([
        "comments.number",
        "comments.likes",
        "comments.contents",
        "comments.createAt",
        "comments.updateAt",
      ])
      .addSelect([
        "commentUser.id",
        "commentUser.username",
        "commentUser.picture",
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
    const queryBuilder = this.articleRepository.createQueryBuilder("article");
    if (release != undefined) {
      queryBuilder.where("article.release = :release", {
        release: release,
      });
    }
    const userArticle = queryBuilder
      .andWhere("article.user.id = :id", { id: user.id })
      .select([
        "article.id",
        "article.title",
        "article.subtitle",
        "article.totalComments",
        "article.likes",
        "article.release",
        "article.createAt",
        "article.updateAt",
      ])
      .skip(skip)
      .take(10)
      .getMany();
    return userArticle;
  }

  async findOwnArticle(usrId: number, aid: number) {
    const article = await this.articleRepository
      .createQueryBuilder("article")
      .leftJoin("article.user", "user")
      .where("article.id = :aid", { aid })
      .select([
        "article.id",
        "article.title",
        "article.subtitle",
        "article.contents",
        "article.release",
        "article.likes",
        "article.ipfsHash",
        "article.createAt",
        "article.updateAt",
      ])
      .addSelect([
        "user.id",
        "user.username",
        "user.email",
        "user.address",
        "user.picture",
      ])
      .getOne();
    console.log(article);
    if (article == null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此文章。",
      });
    }
    if (usrId !== article.user.id) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: "沒有權限查閱此文章",
      });
    }
    return {
      statusCode: HttpStatus.OK,
      article: article,
    };
  }

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
    await article.save();

    if (ArtDto.release == true) {
      return this.release(user.id, article.id);
    }
    return {
      statusCode: HttpStatus.CREATED,
      message: "創建成功",
    };
  }

  async articleLikeStatus(userId: number, aid: number, userLike: boolean) {
    const thisArticle = await this.articleRepository
      .createQueryBuilder("article")
      .where("article.id = :aid", { aid })
      .leftJoinAndSelect("article.userLikes", "users_like_articles")
      .getOne();
    if (!thisArticle) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此文章。",
      });
    }

    const userlikes = thisArticle.userLikes;
    const UserIsExist = userlikes.find(item => item.id === userId);
    // // 將會執行確認是否為喜愛留言和增刪與否
    if (!UserIsExist && userLike) {
      const user = new User();
      user.id = userId;
      thisArticle.userLikes.push(user);
      thisArticle.likes = thisArticle.likes + 1;
      await this.articleRepository.save(thisArticle);
    } else if (UserIsExist && !userLike) {
      thisArticle.userLikes = thisArticle.userLikes.filter(
        item => item.id !== UserIsExist.id,
      );
      thisArticle.likes = thisArticle.likes - 1;
      await this.articleRepository.save(thisArticle);
    }
    return {
      statusCode: HttpStatus.OK,
      message: "修改成功",
    };
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
    if (ArtDto.release == true) {
      return this.release(usrId, article.id);
    }
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
    await this.articleRepository
      .createQueryBuilder("articles")
      .softDelete()
      .where("articles.id = :id", { id: id })
      .execute();
    return {
      statusCode: HttpStatus.OK,
      message: "刪除成功",
    };
  }
  async release(usrId: number, aid: number) {
    const article = await this.articleRepository.findOne({
      where: {
        id: aid,
      },
      relations: {
        user: true,
      },
    });
    if (article == null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此文章。",
      });
    }
    if (usrId !== article.user.id) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: "沒有權限發佈此文章",
      });
    }
    const ipfs = await this.output(aid);
    await this.articleRepository.update(article.id, {
      release: true,
      ipfsHash: ipfs,
    });
    return {
      statusCode: HttpStatus.OK,
      ipfsHash: ipfs,
      aid: article.id,
      createAt: article.createAt,
      updateAt: article.updateAt,
      message: "發佈成功",
    };
  }
  async output(aid: number) {
    const article = await this.articleRepository.findOneBy({ id: aid });
    const templatePath = "templates/markdown.hbs"; // 模板
    const outputPath = `outputs/aid-${article.id}`; // 輸出位置
    const outputData = `outputs/aid-${article.id}/data.json`; // 輸出文章資料
    const outputHtml = `outputs/aid-${article.id}/index.html`; // 輸出網頁檔案

    const templateContent = await readFile(templatePath, "utf8");
    const template = compile(templateContent);
    const renderedContent = template({
      title: article.title,
      subtitle: article.subtitle,
      contents: article.contents,
    });

    if (!existsSync(outputPath)) {
      mkdirSync(outputPath, { recursive: true });
    }
    await writeFile(outputData, JSON.stringify(article), "utf8");
    await writeFile(outputHtml, renderedContent, "utf8");
    return this.ipfsService.ipfsAdd(outputPath);
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

  async commentLikeStatus(
    userId: number,
    aid: number,
    cid: number,
    userLike: boolean,
  ) {
    const thisComment = await this.commentRepository
      .createQueryBuilder("comment")
      .where("comment.number = :cid", { cid })
      .leftJoinAndSelect("comment.article", "article")
      .andWhere("comment.article = :aid", { aid })
      .leftJoinAndSelect("comment.userLikes", "users_like_comments")
      .getOne();
    if (!thisComment || !thisComment.article) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "沒有此文章或留言",
      });
    }

    const userlikes = thisComment.userLikes;
    const UserIsExist = userlikes.find(item => item.id === userId);
    // 將會執行確認是否為喜愛留言和增刪與否
    if (!UserIsExist && userLike) {
      const user = new User();
      user.id = userId;
      thisComment.userLikes.push(user);
      thisComment.likes = thisComment.likes + 1;
      await this.commentRepository.save(thisComment);
    } else if (UserIsExist && !userLike) {
      thisComment.userLikes = thisComment.userLikes.filter(
        item => item.id !== UserIsExist.id,
      );
      thisComment.likes = thisComment.likes - 1;
      await this.commentRepository.save(thisComment);
    }
    return {
      statusCode: HttpStatus.OK,
      message: "修改成功",
    };
  }
}
