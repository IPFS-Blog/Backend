import { MigrationInterface, QueryRunner } from "typeorm";

export class UserImgMigraation1683055377681 implements MigrationInterface {
  name = "UserImgMigraation1683055377681";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`picture\` varchar(255) NULL DEFAULT NULL AFTER \`nonce\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`background\` varchar(255) NULL DEFAULT NULL AFTER \`picture\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`background\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`picture\``);
  }
}
