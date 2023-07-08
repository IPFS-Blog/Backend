import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleUserLikeMigraation1688799226965
  implements MigrationInterface
{
  name = "ArticleUserLikeMigraation1688799226965";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users_like_articles\` 
        (\`usersId\` int NOT NULL,
        \`articlesId\` int NOT NULL,
        INDEX \`IDX_27eaf9bbed3e4a587e154c7804\` (\`usersId\`),
        INDEX \`IDX_4573b3da079efd20d9c1e45dec\` (\`articlesId\`),
        PRIMARY KEY (\`usersId\`, \`articlesId\`)
      ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`articles\` ADD \`likes\` int NOT NULL DEFAULT '0' AFTER \`totalComments\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_like_articles\` ADD CONSTRAINT \`FK_27eaf9bbed3e4a587e154c7804b\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_like_articles\` ADD CONSTRAINT \`FK_4573b3da079efd20d9c1e45deca\` FOREIGN KEY (\`articlesId\`) REFERENCES \`articles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users_like_articles\` DROP FOREIGN KEY \`FK_4573b3da079efd20d9c1e45deca\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_like_articles\` DROP FOREIGN KEY \`FK_27eaf9bbed3e4a587e154c7804b\``,
    );
    await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`likes\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_4573b3da079efd20d9c1e45dec\` ON \`users_like_articles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_27eaf9bbed3e4a587e154c7804\` ON \`users_like_articles\``,
    );
    await queryRunner.query(`DROP TABLE \`users_like_articles\``);
  }
}
