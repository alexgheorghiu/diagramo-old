DROP DATABASE IF EXISTS `diagramo`;

CREATE DATABASE IF NOT EXISTS `diagramo`
    CHARACTER SET utf8
    DEFAULT CHARACTER SET utf8
    COLLATE utf8_general_ci
    DEFAULT COLLATE utf8_general_ci;

USE `diagramo`;

GRANT ALL PRIVILEGES ON  diagramo.* TO  diagramo@localhost IDENTIFIED BY 'diagramo' WITH GRANT OPTION;


DROP TABLE IF EXISTS `setting` ;
CREATE  TABLE IF NOT EXISTS `setting` (
  `name` VARCHAR(128) NOT NULL,
  `value` TEXT,
  PRIMARY KEY (`name`)
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_bin;

DROP TABLE IF EXISTS `user` ;
CREATE  TABLE IF NOT EXISTS `user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `email` VARCHAR(128),
  `password` VARCHAR(128),
  `name` VARCHAR(128),
  `createdDate` DATETIME NOT NULL,
  `lastLoginDate` DATETIME,
  `lastLoginIP` CHAR(40),
  `lastBrowserType` VARCHAR(255),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniqueEmail` (`email`)
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_bin;

DROP TABLE IF EXISTS `diagram` ;
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


DROP TABLE IF EXISTS `invitation` ;
CREATE  TABLE IF NOT EXISTS `invitation` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,  
  `diagramId` INT UNSIGNED NOT NULL,  
  `email` VARCHAR(255),  
  `token` VARCHAR(255) NOT NULL ,   
  `createdDate` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_bin;


DROP TABLE IF EXISTS `diagramdata` ;
CREATE  TABLE IF NOT EXISTS `diagramdata` (  
  `diagramId` INT UNSIGNED NOT NULL,
  `type` ENUM ('dia', 'svg', 'jpg', 'png') NOT NULL,
  `fileName` VARCHAR(255),
  `fileSize` INT UNSIGNED COMMENT 'The size of diagram in bytes',
  `lastUpdate` DATETIME NOT NULL,  
  PRIMARY KEY (`diagramId`, `type`),
  CONSTRAINT `cst_diagramdata_diagram` FOREIGN KEY (`diagramId`) REFERENCES `diagram` (`id`)
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_bin;



DROP TABLE IF EXISTS `userdiagram` ;
CREATE  TABLE IF NOT EXISTS `userdiagram` (
  `userId` INT UNSIGNED NOT NULL,
  `diagramId` INT UNSIGNED NOT NULL,
  `invitedDate` DATETIME NOT NULL COMMENT 'the date user was invited to this diagram',
  `status` ENUM ('accepted', 'pending',  'kickedof') DEFAULT 'accepted',
  `level` ENUM ('editor', 'author') DEFAULT 'editor' COMMENT 'author is the author of the diagram and he can add/edit other editors',
  PRIMARY KEY (`userId`, `diagramId`),
  CONSTRAINT `cst_userdiagram_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `cst_userdiagram_diagram` FOREIGN KEY (`diagramId`) REFERENCES `diagram` (`id`)
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_bin;
