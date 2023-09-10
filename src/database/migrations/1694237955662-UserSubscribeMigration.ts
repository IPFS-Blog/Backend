import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSubscribeMigration1694237955662 implements MigrationInterface {
  name = "UserSubscribeMigration1694237955662";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`subscribes\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`followerId\` int NOT NULL,
        \`authorId\` int NOT NULL,
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscribes\`
        ADD CONSTRAINT \`FK_4f2c85364f8187eeea293bc0283\`
        FOREIGN KEY (\`followerId\`)
        REFERENCES \`users\`(\`id\`)
        ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscribes\` 
        ADD CONSTRAINT \`FK_c33c4172bacb9e8161d5b186a95\`
        FOREIGN KEY (\`authorId\`)
        REFERENCES \`users\`(\`id\`)
        ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`subscribes\` DROP FOREIGN KEY \`FK_c33c4172bacb9e8161d5b186a95\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscribes\` DROP FOREIGN KEY \`FK_4f2c85364f8187eeea293bc0283\``,
    );
    await queryRunner.query(`DROP TABLE \`subscribes\``);
  }
}
