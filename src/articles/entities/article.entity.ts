import { User } from "src/users/entities/user.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Comment } from "./comment.entity";

@Entity({ name: "articles" })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column({
    type: "longtext",
  })
  contents: string;

  @Column({
    type: "tinyint",
    default: 0,
  })
  release: boolean;

  @Column({
    type: "int",
    default: 0,
  })
  totalComments: number;

  @Column("varchar", {
    length: 46,
    nullable: true,
    default: () => "NULL",
  })
  ipfsHash: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => User, user => user.id, {
    nullable: false,
  })
  user: User;

  @OneToMany(() => Comment, comment => comment.article, {
    cascade: true,
  })
  comments: Comment[];
}
