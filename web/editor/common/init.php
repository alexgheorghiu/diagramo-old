<?php

if(file_exists('./diagramo.db')){
    unlink('./diagramo.db');
}

$diagramTable = <<<STOP
    CREATE TABLE diagram (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    public BOOL,
    createdDate DATETIME NOT NULL,
    lastUpdate DATETIME NOT NULL,
    size INT UNSIGNED COMMENT 'The size of diagram in bytes'
    );
STOP;

$userTable = <<< STOP
CREATE  TABLE user (
    id INTEGER PRIMARY KEY,
    email VARCHAR(128) unique,
    password VARCHAR(128),
    name VARCHAR(128),
    createdDate DATETIME NOT NULL,
    lastLoginDate DATETIME,
    lastLoginIP CHAR(40),
    lastBrowserType VARCHAR(255),
    admin boolean default false
);
STOP;


$fakeUser = sprintf("insert into user (email, password, name, createdDate) values ('alex@scriptoid.com', '%s','Alex','%s')", md5('alex'), gmdate('Y-m-d H:i:s'));




$dbhandle = sqlite_open('diagramo.db', 0666, $error);
$ok = sqlite_exec($dbhandle, $diagramTable, $error);
$ok = sqlite_exec($dbhandle, $userTable, $error);
$ok = sqlite_exec($dbhandle, $fakeUser, $error);
print 'ok';
?>
