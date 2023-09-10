import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleInitMigration1681570470399 implements MigrationInterface {
  name = "ArticleInitMigration1681570470399";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`articles\` 
        (\`id\` int NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`overview\` varchar(255) NOT NULL,
        \`contents\` longtext NOT NULL,
        \`release\` tinyint NOT NULL,
        \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`articles\``);
  }
}
