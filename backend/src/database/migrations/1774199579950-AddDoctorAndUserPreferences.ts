import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDoctorAndUserPreferences1774199579950 implements MigrationInterface {
    name = 'AddDoctorAndUserPreferences1774199579950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`doctors\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`specialty\` varchar(255) NOT NULL, \`hospital\` varchar(255) NOT NULL, \`experience\` int NOT NULL, \`rating\` float NOT NULL DEFAULT '5', \`isAvailable\` tinyint NOT NULL DEFAULT 1, \`imageUrl\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`emailNotifications\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`whatsappNotifications\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`whatsappNumber\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`whatsappNumber\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`whatsappNotifications\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`emailNotifications\``);
        await queryRunner.query(`DROP TABLE \`doctors\``);
    }

}
