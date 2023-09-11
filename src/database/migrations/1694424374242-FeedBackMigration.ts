import { MigrationInterface, QueryRunner } from "typeorm";

export class FeedBackMigration1694424374242 implements MigrationInterface {
  name = "FeedBackMigration1694424374242";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`feedbacks\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`nickName\` varchar(255) NOT NULL,
        \`title\` varchar(255) NOT NULL,
        \`contents\` longtext NOT NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`feedbacks\``);
  }
}
