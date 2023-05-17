import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1684152799577 implements MigrationInterface {
    name = 'Users1684152799577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_info\` DROP FOREIGN KEY \`FK_3a7fa0c3809d19eaf2fb4f65949\``);
        await queryRunner.query(`ALTER TABLE \`user_info\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_info\` ADD CONSTRAINT \`FK_3a7fa0c3809d19eaf2fb4f65949\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_info\` DROP FOREIGN KEY \`FK_3a7fa0c3809d19eaf2fb4f65949\``);
        await queryRunner.query(`ALTER TABLE \`user_info\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_info\` ADD CONSTRAINT \`FK_3a7fa0c3809d19eaf2fb4f65949\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NOT NULL`);
    }

}
