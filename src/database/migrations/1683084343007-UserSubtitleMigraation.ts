import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSubtitleMigraation1683084343007 implements MigrationInterface {
  name = "UserSubtitleMigraation1683084343007";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` CHANGE \`overview\` \`subtitle\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` CHANGE \`subtitle\` \`overview\` varchar(255) NOT NULL`,
    );
  }
}
