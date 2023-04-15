import { User } from "src/users/entities/user.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "articles" })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  overview: string;

  @Column({
    type: "longtext",
  })
  contents: string;

  @Column({
    type: "tinyint",
  })
  release: boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => User, user => user.id, {
    nullable: false,
  })
  user: User;
}
