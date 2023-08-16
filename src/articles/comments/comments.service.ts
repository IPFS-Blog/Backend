import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

import { CreateCommentDto } from "../dto/create-comment.dto";
import { Article } from "../entities/article.entity";
import { Comment } from "../entities/comment.entity";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}
  async addComment(userId: number, aid: number, ccDto: CreateCommentDto) {
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
    comment.contents = ccDto.contents;
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
    ccDto: CreateCommentDto,
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
    await this.commentRepository.update(thisComment.id, ccDto);
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

    const userLikes = thisComment.userLikes;
    const UserIsExist = userLikes.find(item => item.id === userId);
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
