import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewUserProperties1782364461078 implements MigrationInterface {
  name = 'AddNewUserProperties1782364461078';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
  }
}
