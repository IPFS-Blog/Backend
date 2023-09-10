import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentUserLikeMigraation1688800207750
  implements MigrationInterface
{
  name = "CommentUserLikeMigraation1688800207750";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users_like_comments\`
        (\`usersId\` int NOT NULL,
        \`commentsId\` int NOT NULL,
        INDEX \`IDX_f319138c065f015e3977e2566d\` (\`usersId\`),
        INDEX \`IDX_53c245283a42385d8db7f97c08\` (\`commentsId\`),
        PRIMARY KEY (\`usersId\`, \`commentsId\`)
      ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_like_comments\` ADD CONSTRAINT \`FK_f319138c065f015e3977e2566de\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_like_comments\` ADD CONSTRAINT \`FK_53c245283a42385d8db7f97c081\` FOREIGN KEY (\`commentsId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users_like_comments\` DROP FOREIGN KEY \`FK_53c245283a42385d8db7f97c081\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_like_comments\` DROP FOREIGN KEY \`FK_f319138c065f015e3977e2566de\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_53c245283a42385d8db7f97c08\` ON \`users_like_comments\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f319138c065f015e3977e2566d\` ON \`users_like_comments\``,
    );
    await queryRunner.query(`DROP TABLE \`users_like_comments\``);
  }
}
