import { MigrationInterface, QueryRunner } from "typeorm";

export class UserInitMigration1678531103933 implements MigrationInterface {
  name = "UserInitMigration1678531103933";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\`
        (\`id\` int NOT NULL AUTO_INCREMENT,
        \`username\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`address\` varchar(255) NOT NULL,
        \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`),
        UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
        UNIQUE INDEX \`IDX_b0ec0293d53a1385955f9834d5\` (\`address\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_b0ec0293d53a1385955f9834d5\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
