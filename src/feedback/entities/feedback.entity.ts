import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "feedbacks" })
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  nickName: string;

  @Column()
  title: string;

  @Column({
    type: "longtext",
  })
  contents: string;
}
