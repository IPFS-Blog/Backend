import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentCalMigration1685544958818 implements MigrationInterface {
  name = "CommentCalMigration1685544958818";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD \`number\` int NOT NULL AFTER \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`articles\` ADD \`totalComments\` int NOT NULL AFTER \`release\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` DROP COLUMN \`totalComments\``,
    );
    await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`number\``);
  }
}
