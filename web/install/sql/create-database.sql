DROP DATABASE IF EXISTS `diagramoscript`;
CREATE DATABASE IF NOT EXISTS `diagramoscript`;
USE `diagramoscript`;

GRANT ALL PRIVILEGES ON  diagramo.* TO  diagramo@localhost IDENTIFIED BY 'diagramo' WITH GRANT OPTION;