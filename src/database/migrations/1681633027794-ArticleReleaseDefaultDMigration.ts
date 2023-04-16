import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleReleaseDefaultDMigration1681633027794
  implements MigrationInterface
{
  name = "ArticleReleaseDefaultDMigration1681633027794";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` CHANGE \`release\` \`release\` tinyint NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` CHANGE \`release\` \`release\` tinyint NOT NULL`,
    );
  }
}
