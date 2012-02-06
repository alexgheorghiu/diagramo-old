DROP DATABASE IF EXISTS `diagramo`;
CREATE DATABASE IF NOT EXISTS `diagramo`;
USE `diagramo`;

GRANT ALL PRIVILEGES ON  diagramo.* TO  diagramo@localhost IDENTIFIED BY 'diagramo' WITH GRANT OPTION;