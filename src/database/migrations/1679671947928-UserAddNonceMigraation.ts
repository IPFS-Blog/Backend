import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddNonceMigraation1679671947928 implements MigrationInterface {
  name = "UserAddNonceMigraation1679671947928";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`nonce\` varchar(255) NULL AFTER \`address\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`nonce\``);
  }
}
