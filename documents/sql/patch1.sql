-- creates the version 1 of the database --
INSERT INTO `setting` (`name`, `value`) VALUES ('database_version' , '1');

-- Add proper constraint. An invitation belongs to a diagram --
alter table `invitation`  add CONSTRAINT `cst_invitation_diagram` FOREIGN KEY (`diagramId`) REFERENCES `diagram` (`id`);