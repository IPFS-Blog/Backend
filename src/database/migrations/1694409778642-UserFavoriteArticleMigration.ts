import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFavoriteArticleMigration1694409778642
  implements MigrationInterface
{
  name = "UserFavoriteArticleMigration1694409778642";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users_favorite_articles\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`userId\` int NOT NULL,
        \`articleId\` int NOT NULL,
        \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_favorite_articles\` 
      ADD CONSTRAINT \`FK_3015e1c00071b0706c6dfb7edea\`
      FOREIGN KEY (\`userId\`)
      REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_favorite_articles\` 
      ADD CONSTRAINT \`FK_42f7bca64652ec94d2353e7e0c8\`
      FOREIGN KEY (\`articleId\`)
      REFERENCES \`articles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users_favorite_articles\` 
      DROP FOREIGN KEY \`FK_42f7bca64652ec94d2353e7e0c8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_favorite_articles\` 
      DROP FOREIGN KEY \`FK_3015e1c00071b0706c6dfb7edea\``,
    );
    await queryRunner.query(`DROP TABLE \`users_favorite_articles\``);
  }
}
