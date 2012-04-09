DROP TABLE IF EXISTS `diagram`;

CREATE TABLE `diagram` (
`id` INTEGER PRIMARY KEY,
`title` VARCHAR(255),
`description` TEXT,
`public` BOOL,
`createdDate` DATETIME NOT NULL,
`lastUpdate` DATETIME NOT NULL,
`size` INT UNSIGNED COMMENT 'The size of diagram in bytes'
);

DROP TABLE IF EXISTS `setting`;
CREATE  TABLE `setting` (
    `name` VARCHAR(128) PRIMARY KEY,
    `value` TEXT
);

-- create table --
DROP TABLE IF EXISTS `user`;
CREATE  TABLE IF NOT EXISTS `user` (
    `id` INTEGER PRIMARY KEY,
    `email` VARCHAR(128) unique,
    `password` VARCHAR(128),
    `name` VARCHAR(128),
    `createdDate` DATETIME NOT NULL,
    `lastLoginDate` DATETIME,
    `lastLoginIP` CHAR(40),
    `lastBrowserType` VARCHAR(255),
    `admin` boolean default false
);


-- create table --
DROP TABLE IF EXISTS `diagramdata`;
CREATE  TABLE IF NOT EXISTS `diagramdata` (  
    `diagramId` INT UNSIGNED NOT NULL,
    `type` VARCHAR(10) NOT NULL, -- only 'dia', 'svg', 'jpg', 'png'
    `fileName` VARCHAR(255),
    `fileSize` INT UNSIGNED COMMENT 'The size of diagram in bytes',
    `lastUpdate` DATETIME NOT NULL,  
    FOREIGN KEY(diagramId) REFERENCES diagram(id),
    PRIMARY KEY (`diagramId`, `type`)    
);


insert into `diagram` (`id`, `title`, `description`, `public`, `createdDate`, `lastUpdate`, `size`)
    values(1, 'First diagram', 'An example of first Diagram', 0, '2012-04-09 10:46:50', '2012-04-09 10:46:50', 512);

insert into `diagram` (`id`, `title`, `description`, `public`, `createdDate`, `lastUpdate`, `size`)
    values(2, 'Second diagram', 'An example of second Diagram', 0, '2012-04-09 10:47:50', '2012-04-09 10:47:50', 752);


insert into `user` (`id`, `email`, `password`, `name`, `createdDate`, `admin`)
    values(1, 'alex@scriptoid.com', '1234567890', 'Alex Gheorghiu', '2012-04-09 10:46:50', 'true');

insert into `user` (`email`, `password`, `name`, `createdDate`, `admin`)
    values('nisa@scriptoid.com', '1234567890', 'Nisa', '2012-04-09 10:46:50', 'false');

