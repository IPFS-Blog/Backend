import { ApiProperty } from "@nestjs/swagger";
import { Article } from "src/articles/entities/article.entity";
import { Comment } from "src/articles/entities/comment.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @ApiProperty({ description: "使用者ID", example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "使用者名稱", example: "Jhon" })
  @Column({
    unique: true,
  })
  username: string;

  @ApiProperty({
    description: "使用者信箱",
    example: "jhon@gmail.com",
  })
  @Column({
    unique: true,
  })
  email: string;

  @ApiProperty({
    description: "metamask 錢包地址",
    example: "0x379706b84d1B02242610d15b4349a7A1387d4976",
  })
  @Column({
    unique: true,
  })
  address: string;

  @ApiProperty({
    description: "metamask 驗證碼",
    example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  })
  @Column({
    nullable: true,
    default: () => "NULL",
  })
  nonce: string;

  @Column({
    nullable: true,
    default: () => "NULL",
  })
  picture: string;

  @Column({
    nullable: true,
    default: () => "NULL",
  })
  background: string;

  @OneToMany(() => Article, article => article.user, {
    cascade: true,
  })
  articles: Article[];

  @OneToMany(() => Comment, comment => comment.id, {
    cascade: true,
  })
  comments: Comment[];

  @ApiProperty({ description: "創建時間" })
  @CreateDateColumn()
  createAt: Date;

  @ApiProperty({ description: "更新時間" })
  @UpdateDateColumn()
  updateAt: Date;
}
