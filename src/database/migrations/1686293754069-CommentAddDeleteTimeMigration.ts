import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentAddDeleteTimeMigration1686293754069
  implements MigrationInterface
{
  name = "CommentAddDeleteTimeMigration1686293754069";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD \`deletedAt\` datetime(6) NULL DEFAULT NULL AFTER \`updateAt\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP COLUMN \`deletedAt\``,
    );
  }
}
