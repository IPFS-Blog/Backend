import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentInitMigration1685536742284 implements MigrationInterface {
  name = "CommentInitMigration1685536742284";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`comments\`(
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`likes\` int NOT NULL DEFAULT '0',
        \`contents\` longtext NOT NULL,
        \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`userId\` int NOT NULL,
        \`articleId\` int NOT NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\`
        ADD CONSTRAINT \`FK_7e8d7c49f218ebb14314fdb3749\`
        FOREIGN KEY (\`userId\`)
        REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\`
      ADD CONSTRAINT \`FK_b0011304ebfcb97f597eae6c31f\`
      FOREIGN KEY (\`articleId\`)
      REFERENCES \`articles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_b0011304ebfcb97f597eae6c31f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7e8d7c49f218ebb14314fdb3749\``,
    );
    await queryRunner.query(`DROP TABLE \`comments\``);
  }
}
