import { MigrationInterface, QueryRunner } from "typeorm";

export class FeedBackTypeMigration1694425138129 implements MigrationInterface {
  name = "FeedBackTypeMigration1694425138129";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`feedbacks_types\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`description\` varchar(255) NOT NULL,
        PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` ADD \`typeId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` 
      ADD CONSTRAINT \`FK_4c66ff5548c628bf594d9f8151e\`
      FOREIGN KEY (\`typeId\`)
      REFERENCES \`feedbacks_types\`(\`id\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` 
      DROP FOREIGN KEY \`FK_4c66ff5548c628bf594d9f8151e\``,
    );
    await queryRunner.query(`ALTER TABLE \`feedbacks\` DROP COLUMN \`typeId\``);
    await queryRunner.query(`DROP TABLE \`feedbacks_types\``);
  }
}
