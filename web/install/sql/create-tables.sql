
-- drop table--
DROP TABLE IF EXISTS `diagramdata`;

-- drop table--
DROP TABLE IF EXISTS `diagram`;

-- drop table--
DROP TABLE IF EXISTS `user`;

-- drop table--
DROP TABLE IF EXISTS `setting`;

-- create table --
CREATE  TABLE IF NOT EXISTS `setting` (
    `name` VARCHAR(128) NOT NULL,
    `value` TEXT,
    PRIMARY KEY (`name`)
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_bin;

-- create table --
CREATE  TABLE IF NOT EXISTS `user` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
    `email` VARCHAR(128),
    `password` VARCHAR(128),
    `name` VARCHAR(128),
    `createdDate` DATETIME NOT NULL,
    `lastLoginDate` DATETIME,
    `lastLoginIP` CHAR(40),
    `lastBrowserType` VARCHAR(255),
    `admin` boolean default false,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniqueEmail` (`email`)
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_bin;

-- create table --
CREATE  TABLE IF NOT EXISTS `diagram` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
    `hash` VARCHAR(6) NOT NULL ,
    `title` VARCHAR(255),
    `description` TEXT,
    `public` BOOL,
    `createdDate` DATETIME NOT NULL,
    `lastUpdate` DATETIME NOT NULL,
    `size` INT UNSIGNED COMMENT 'The size of diagram in bytes',  
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniqueHash` (`hash`)
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_bin;


-- create table --
CREATE  TABLE IF NOT EXISTS `diagramdata` (  
    `diagramId` INT UNSIGNED NOT NULL,
    `type` ENUM ('dia', 'svg', 'jpg', 'png') NOT NULL,
    `fileName` VARCHAR(255),
    `fileSize` INT UNSIGNED COMMENT 'The size of diagram in bytes',
    `lastUpdate` DATETIME NOT NULL,  
    PRIMARY KEY (`diagramId`, `type`),
    CONSTRAINT `cst_diagramdata_diagram` FOREIGN KEY (`diagramId`) REFERENCES `diagram` (`id`)
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_bin;


-- insert data --
INSERT INTO `setting` (`name`, `value`) VALUES ('database_version' , '1');
