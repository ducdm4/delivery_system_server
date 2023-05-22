import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1684749931351 implements MigrationInterface {
    name = 'Init1684749931351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`addresses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cityId\` int NOT NULL DEFAULT '1', \`districtId\` int NULL, \`wardId\` int NULL, \`street\` varchar(255) NULL, \`building\` varchar(255) NULL, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`configs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`engName\` varchar(255) NOT NULL, \`createdAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`districts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime NOT NULL, \`cityId\` int NULL, UNIQUE INDEX \`REL_65f489c5687887adeeb14b87df\` (\`cityId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NULL, \`role\` int NOT NULL DEFAULT '1', \`createdAt\` datetime NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`photos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`createdAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` int NOT NULL DEFAULT '1', \`name\` varchar(255) NOT NULL, \`parentStation\` int NULL, \`wardList\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, \`addressId\` int NULL, UNIQUE INDEX \`REL_d077f78e3da856a69763bb467c\` (\`addressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`employee_info\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`isActive\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, \`identityCardImage1Id\` int NULL, \`identityCardImage2Id\` int NULL, \`userId\` int NULL, \`stationId\` int NULL, UNIQUE INDEX \`REL_3978a0756ce89065075d6d1034\` (\`identityCardImage1Id\`), UNIQUE INDEX \`REL_fb2ae22bdee99c7250d7e4cdaf\` (\`identityCardImage2Id\`), UNIQUE INDEX \`REL_c4ac770e19c7fbfc8a029dbd2c\` (\`userId\`), UNIQUE INDEX \`REL_3b4bef102967f512afe9f968db\` (\`stationId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uniqueTrackingId\` varchar(255) NOT NULL, \`senderName\` varchar(255) NOT NULL, \`senderPhone\` varchar(255) NOT NULL, \`receiverName\` varchar(255) NOT NULL, \`receiverPhone\` varchar(255) NOT NULL, \`cashOnDelivery\` float NULL, \`shippingFare\` float NOT NULL, \`numberOfAtTemp\` int NOT NULL, \`isCancel\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, \`userId\` int NULL, \`pickupAddressId\` int NULL, \`dropOffAddressId\` int NULL, UNIQUE INDEX \`REL_4eee1e5da3efd4038a2746bf50\` (\`pickupAddressId\`), UNIQUE INDEX \`REL_1b65195fd4ef36e4c63f416977\` (\`dropOffAddressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_tracking\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` int NOT NULL, \`cashOnDelivery\` float NULL, \`shippingFare\` float NOT NULL, \`isCancel\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, \`orderId\` int NULL, \`stationInChargeId\` int NULL, \`collectorInChargeId\` int NULL, \`shipperInChargeId\` int NULL, \`dropOffAddressId\` int NULL, UNIQUE INDEX \`REL_bfb906fe040593decbb22794d8\` (\`dropOffAddressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`parcels\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`weight\` float NOT NULL, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, \`orderId\` int NULL, \`photoId\` int NULL, UNIQUE INDEX \`REL_7ff331a7e5c6057dccd871face\` (\`photoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`wards\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime NOT NULL, \`districtId\` int NULL, UNIQUE INDEX \`REL_812309cfc78b10b505a6cd44df\` (\`districtId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`routes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` int NOT NULL, \`isGoToParent\` tinyint NULL, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, \`employeeId\` int NULL, UNIQUE INDEX \`REL_bc1a04791685505a291befd287\` (\`employeeId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_info\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`dob\` varchar(255) NOT NULL, \`gender\` tinyint NOT NULL, \`phone\` varchar(255) NULL, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, \`profilePictureId\` int NULL, \`userId\` int NULL, \`addressId\` int NULL, UNIQUE INDEX \`REL_20aacdad0e3381adf77f6b8756\` (\`profilePictureId\`), UNIQUE INDEX \`REL_3a7fa0c3809d19eaf2fb4f6594\` (\`userId\`), UNIQUE INDEX \`REL_917dca91af4d24821a88ab0bbd\` (\`addressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`routes_wards_wards\` (\`routesId\` int NOT NULL, \`wardsId\` int NOT NULL, INDEX \`IDX_e27377bdd88b703b80e06f18c1\` (\`routesId\`), INDEX \`IDX_189e4681722bcba73213d279a5\` (\`wardsId\`), PRIMARY KEY (\`routesId\`, \`wardsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`districts\` ADD CONSTRAINT \`FK_65f489c5687887adeeb14b87df7\` FOREIGN KEY (\`cityId\`) REFERENCES \`cities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stations\` ADD CONSTRAINT \`FK_d077f78e3da856a69763bb467c0\` FOREIGN KEY (\`addressId\`) REFERENCES \`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_info\` ADD CONSTRAINT \`FK_3978a0756ce89065075d6d1034e\` FOREIGN KEY (\`identityCardImage1Id\`) REFERENCES \`photos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_info\` ADD CONSTRAINT \`FK_fb2ae22bdee99c7250d7e4cdafd\` FOREIGN KEY (\`identityCardImage2Id\`) REFERENCES \`photos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_info\` ADD CONSTRAINT \`FK_c4ac770e19c7fbfc8a029dbd2c6\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_info\` ADD CONSTRAINT \`FK_3b4bef102967f512afe9f968db3\` FOREIGN KEY (\`stationId\`) REFERENCES \`stations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_4eee1e5da3efd4038a2746bf50c\` FOREIGN KEY (\`pickupAddressId\`) REFERENCES \`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_1b65195fd4ef36e4c63f4169774\` FOREIGN KEY (\`dropOffAddressId\`) REFERENCES \`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_tracking\` ADD CONSTRAINT \`FK_85acfbdf5c1c33daca863f8118b\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_tracking\` ADD CONSTRAINT \`FK_5d3b1dc47b00f72cd805bd2a284\` FOREIGN KEY (\`stationInChargeId\`) REFERENCES \`stations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_tracking\` ADD CONSTRAINT \`FK_14ca841b5122aca4bbe9dea6f5f\` FOREIGN KEY (\`collectorInChargeId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_tracking\` ADD CONSTRAINT \`FK_3ea424d49a50b261feecec5477f\` FOREIGN KEY (\`shipperInChargeId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_tracking\` ADD CONSTRAINT \`FK_bfb906fe040593decbb22794d8f\` FOREIGN KEY (\`dropOffAddressId\`) REFERENCES \`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`parcels\` ADD CONSTRAINT \`FK_6ba773e1ec316866a17d46885a4\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`parcels\` ADD CONSTRAINT \`FK_7ff331a7e5c6057dccd871face0\` FOREIGN KEY (\`photoId\`) REFERENCES \`photos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wards\` ADD CONSTRAINT \`FK_812309cfc78b10b505a6cd44df5\` FOREIGN KEY (\`districtId\`) REFERENCES \`districts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`routes\` ADD CONSTRAINT \`FK_bc1a04791685505a291befd287d\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_info\` ADD CONSTRAINT \`FK_20aacdad0e3381adf77f6b8756c\` FOREIGN KEY (\`profilePictureId\`) REFERENCES \`photos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_info\` ADD CONSTRAINT \`FK_3a7fa0c3809d19eaf2fb4f65949\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_info\` ADD CONSTRAINT \`FK_917dca91af4d24821a88ab0bbdd\` FOREIGN KEY (\`addressId\`) REFERENCES \`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`routes_wards_wards\` ADD CONSTRAINT \`FK_e27377bdd88b703b80e06f18c19\` FOREIGN KEY (\`routesId\`) REFERENCES \`routes\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`routes_wards_wards\` ADD CONSTRAINT \`FK_189e4681722bcba73213d279a55\` FOREIGN KEY (\`wardsId\`) REFERENCES \`wards\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`routes_wards_wards\` DROP FOREIGN KEY \`FK_189e4681722bcba73213d279a55\``);
        await queryRunner.query(`ALTER TABLE \`routes_wards_wards\` DROP FOREIGN KEY \`FK_e27377bdd88b703b80e06f18c19\``);
        await queryRunner.query(`ALTER TABLE \`user_info\` DROP FOREIGN KEY \`FK_917dca91af4d24821a88ab0bbdd\``);
        await queryRunner.query(`ALTER TABLE \`user_info\` DROP FOREIGN KEY \`FK_3a7fa0c3809d19eaf2fb4f65949\``);
        await queryRunner.query(`ALTER TABLE \`user_info\` DROP FOREIGN KEY \`FK_20aacdad0e3381adf77f6b8756c\``);
        await queryRunner.query(`ALTER TABLE \`routes\` DROP FOREIGN KEY \`FK_bc1a04791685505a291befd287d\``);
        await queryRunner.query(`ALTER TABLE \`wards\` DROP FOREIGN KEY \`FK_812309cfc78b10b505a6cd44df5\``);
        await queryRunner.query(`ALTER TABLE \`parcels\` DROP FOREIGN KEY \`FK_7ff331a7e5c6057dccd871face0\``);
        await queryRunner.query(`ALTER TABLE \`parcels\` DROP FOREIGN KEY \`FK_6ba773e1ec316866a17d46885a4\``);
        await queryRunner.query(`ALTER TABLE \`order_tracking\` DROP FOREIGN KEY \`FK_bfb906fe040593decbb22794d8f\``);
        await queryRunner.query(`ALTER TABLE \`order_tracking\` DROP FOREIGN KEY \`FK_3ea424d49a50b261feecec5477f\``);
        await queryRunner.query(`ALTER TABLE \`order_tracking\` DROP FOREIGN KEY \`FK_14ca841b5122aca4bbe9dea6f5f\``);
        await queryRunner.query(`ALTER TABLE \`order_tracking\` DROP FOREIGN KEY \`FK_5d3b1dc47b00f72cd805bd2a284\``);
        await queryRunner.query(`ALTER TABLE \`order_tracking\` DROP FOREIGN KEY \`FK_85acfbdf5c1c33daca863f8118b\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_1b65195fd4ef36e4c63f4169774\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_4eee1e5da3efd4038a2746bf50c\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``);
        await queryRunner.query(`ALTER TABLE \`employee_info\` DROP FOREIGN KEY \`FK_3b4bef102967f512afe9f968db3\``);
        await queryRunner.query(`ALTER TABLE \`employee_info\` DROP FOREIGN KEY \`FK_c4ac770e19c7fbfc8a029dbd2c6\``);
        await queryRunner.query(`ALTER TABLE \`employee_info\` DROP FOREIGN KEY \`FK_fb2ae22bdee99c7250d7e4cdafd\``);
        await queryRunner.query(`ALTER TABLE \`employee_info\` DROP FOREIGN KEY \`FK_3978a0756ce89065075d6d1034e\``);
        await queryRunner.query(`ALTER TABLE \`stations\` DROP FOREIGN KEY \`FK_d077f78e3da856a69763bb467c0\``);
        await queryRunner.query(`ALTER TABLE \`districts\` DROP FOREIGN KEY \`FK_65f489c5687887adeeb14b87df7\``);
        await queryRunner.query(`DROP INDEX \`IDX_189e4681722bcba73213d279a5\` ON \`routes_wards_wards\``);
        await queryRunner.query(`DROP INDEX \`IDX_e27377bdd88b703b80e06f18c1\` ON \`routes_wards_wards\``);
        await queryRunner.query(`DROP TABLE \`routes_wards_wards\``);
        await queryRunner.query(`DROP INDEX \`REL_917dca91af4d24821a88ab0bbd\` ON \`user_info\``);
        await queryRunner.query(`DROP INDEX \`REL_3a7fa0c3809d19eaf2fb4f6594\` ON \`user_info\``);
        await queryRunner.query(`DROP INDEX \`REL_20aacdad0e3381adf77f6b8756\` ON \`user_info\``);
        await queryRunner.query(`DROP TABLE \`user_info\``);
        await queryRunner.query(`DROP INDEX \`REL_bc1a04791685505a291befd287\` ON \`routes\``);
        await queryRunner.query(`DROP TABLE \`routes\``);
        await queryRunner.query(`DROP INDEX \`REL_812309cfc78b10b505a6cd44df\` ON \`wards\``);
        await queryRunner.query(`DROP TABLE \`wards\``);
        await queryRunner.query(`DROP INDEX \`REL_7ff331a7e5c6057dccd871face\` ON \`parcels\``);
        await queryRunner.query(`DROP TABLE \`parcels\``);
        await queryRunner.query(`DROP INDEX \`REL_bfb906fe040593decbb22794d8\` ON \`order_tracking\``);
        await queryRunner.query(`DROP TABLE \`order_tracking\``);
        await queryRunner.query(`DROP INDEX \`REL_1b65195fd4ef36e4c63f416977\` ON \`orders\``);
        await queryRunner.query(`DROP INDEX \`REL_4eee1e5da3efd4038a2746bf50\` ON \`orders\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP INDEX \`REL_3b4bef102967f512afe9f968db\` ON \`employee_info\``);
        await queryRunner.query(`DROP INDEX \`REL_c4ac770e19c7fbfc8a029dbd2c\` ON \`employee_info\``);
        await queryRunner.query(`DROP INDEX \`REL_fb2ae22bdee99c7250d7e4cdaf\` ON \`employee_info\``);
        await queryRunner.query(`DROP INDEX \`REL_3978a0756ce89065075d6d1034\` ON \`employee_info\``);
        await queryRunner.query(`DROP TABLE \`employee_info\``);
        await queryRunner.query(`DROP INDEX \`REL_d077f78e3da856a69763bb467c\` ON \`stations\``);
        await queryRunner.query(`DROP TABLE \`stations\``);
        await queryRunner.query(`DROP TABLE \`photos\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_65f489c5687887adeeb14b87df\` ON \`districts\``);
        await queryRunner.query(`DROP TABLE \`districts\``);
        await queryRunner.query(`DROP TABLE \`cities\``);
        await queryRunner.query(`DROP TABLE \`configs\``);
        await queryRunner.query(`DROP TABLE \`addresses\``);
    }

}
