<?php
/**
 * http://zetcode.com/databases/sqlitephptutorial/
 */

$dbhandle = sqlite_open('test.db', 0666, $error);

$stm = "DROP TABLE diagram";
$ok = sqlite_exec($dbhandle, $stm, $error);


$stm = "CREATE TABLE diagram (
id INTEGER PRIMARY KEY,
title VARCHAR(255),
description TEXT,
public BOOL,
createdDate DATETIME NOT NULL,
lastUpdate DATETIME NOT NULL,
size INT UNSIGNED COMMENT 'The size of diagram in bytes'
)";

//$stm = "CREATE TABLE Friends(Id integer PRIMARY KEY, 
//       Name text UNIQUE NOT NULL, Sex text CHECK(Sex IN ('M', 'F')))";
$ok = sqlite_exec($dbhandle, $stm, $error);

if (!$ok)
   die("Cannot execute query. $error");

$stm1 = "INSERT INTO diagram (title, description, createdDate, lastUpdate, size) 
    VALUES('test', 'Test description', '2012-11-23 12:34:56', '2012-11-24 13:34:56', 1023)";
$ok1 = sqlite_exec($dbhandle, $stm1);
if (!$ok1) die("Cannot execute statement.");

$stm1 = "INSERT INTO diagram (title, description, createdDate, lastUpdate, size) 
    VALUES('test2', 'Test description2', '2012-11-23 12:34:56', '2012-11-24 13:34:56', 1023)";
$ok1 = sqlite_exec($dbhandle, $stm1);
if (!$ok1) die("Cannot execute statement.");

echo "Table diagram created successfully";


$query = "SELECT * FROM diagram";
$result = sqlite_query($dbhandle, $query);
if (!$result) die("Cannot execute query.");

while ($row = sqlite_fetch_array($result, SQLITE_ASSOC)) {
    echo "\n" . $row['id']  . " : " . $row['title'];
}

sqlite_close($dbhandle);
?>
