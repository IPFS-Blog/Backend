import { MigrationInterface, QueryRunner } from "typeorm";

export class UserConfirmMigration1691725964231 implements MigrationInterface {
  name = "UserConfirmMigration1691725964231";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`confirmCode\` varchar(255) NOT NULL AFTER \`email\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`emailVerified\` tinyint NOT NULL DEFAULT '0' AFTER \`confirmCode\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`emailVerified\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`confirmCode\``,
    );
  }
}
