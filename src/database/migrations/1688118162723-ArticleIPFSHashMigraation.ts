import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleIPFSHashMigraation1688118162723
  implements MigrationInterface
{
  name = "ArticleIPFSHashMigraation1688118162723";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` ADD \`ipfsHash\` varchar(46) NULL DEFAULT NULL AFTER \`totalComments\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` DROP COLUMN \`ipfsHash\``,
    );
  }
}
