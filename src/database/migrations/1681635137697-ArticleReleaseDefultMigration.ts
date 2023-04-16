import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleReleaseDefultMigration1681635137697
  implements MigrationInterface
{
  name = "ArticleReleaseDefultMigration1681635137697";

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
