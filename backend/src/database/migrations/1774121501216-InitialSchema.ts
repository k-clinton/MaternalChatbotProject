import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1774121501216 implements MigrationInterface {
    name = 'InitialSchema1774121501216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`vitals_logs\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`bloodPressure\` varchar(255) NULL, \`weight\` float NULL, \`fetalMovement\` int NULL, \`loggedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointments\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`doctor\` varchar(255) NOT NULL, \`date\` datetime NOT NULL, \`notes\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'pregnant', \`weeksPregnant\` int NULL, \`dueDate\` date NULL, \`emergencyContact\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`vitals_logs\` ADD CONSTRAINT \`FK_fea8eb48311941651681204c2ed\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_01733651151c8a1d6d980135cc4\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_01733651151c8a1d6d980135cc4\``);
        await queryRunner.query(`ALTER TABLE \`vitals_logs\` DROP FOREIGN KEY \`FK_fea8eb48311941651681204c2ed\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`appointments\``);
        await queryRunner.query(`DROP TABLE \`vitals_logs\``);
    }

}
