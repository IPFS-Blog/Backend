import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleSoftDeleteMigraation1688118549258
  implements MigrationInterface
{
  name = "ArticleSoftDeleteMigraation1688118549258";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` ADD \`deletedAt\` datetime(6) NULL DEFAULT NULL AFTER \`updateAt\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` DROP COLUMN \`deletedAt\``,
    );
  }
}
