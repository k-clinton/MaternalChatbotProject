import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMedicationsTable1774195106949 implements MigrationInterface {
    name = 'AddMedicationsTable1774195106949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableExists = await queryRunner.hasTable("medications");
        if (!tableExists) {
            await queryRunner.query(`CREATE TABLE \`medications\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`dosage\` varchar(255) NULL, \`frequency\` varchar(255) NULL, \`lastTakenAt\` datetime NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            await queryRunner.query(`ALTER TABLE \`medications\` ADD CONSTRAINT \`FK_medications_userId\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`medications\` DROP FOREIGN KEY \`FK_medications_userId\``);
        await queryRunner.query(`DROP TABLE \`medications\``);
    }
}
