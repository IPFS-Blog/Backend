import { MigrationInterface, QueryRunner } from "typeorm";

export class UserArticleRelationMigration1681571659814
  implements MigrationInterface
{
  name = "UserArticleRelationMigration1681571659814";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` ADD \`userId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_a9d18538b896fe2a6762e143bea\` FOREIGN KEY (\`userId\`)
      REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_a9d18538b896fe2a6762e143bea\``,
    );
    await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`userId\``);
  }
}
