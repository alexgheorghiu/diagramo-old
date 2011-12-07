<?php

/*WEBADDRESS points the URL where application is installed.
 *It is used mainly by the email engine or cron script to add proper back links
 *to the application.
 */

//where diagrams will be stored
define('STOREFOLDER','/diagrams'); //no trailing slashes

define('WEBADDRESS','http://diagramo-alex'); //no trailing slashes
define('WEBADDRESS_SSL','https://diagramo-alex'); //no trailing slashes


#database settings
// The database server address.  Example: localhost, localhost:3306 or 87.230.14.9
#define('DB_ADDRESS', '10.0.0.149');
define('DB_ADDRESS', 'localhost');


//The database name. Example: diagramo
define('DB_NAME', 'diagramo');

//The database user. Example: diagramo or root
define('DB_USER_NAME', 'diagramo');

/*The database user's password, in case it is present. In case you do not have a
password (localhost & root access) just use '' (empty) value.
 * Ex: define('DB_USER_PASS', '');
 */
define('DB_USER_PASS', 'diagramo');

/**Store the version of the editor. Usefull in bugs and software update*/
define('VERSION', '2.0b1');


#debug information
define('DEBUG', true);


#SMTP settings
define('SMTP_ENABLE', true);
define('SMTP_HOST', 'ssl://smtp.gmail.com');
define('SMTP_PORT', '465');
define('SMTP_USERNAME', '#####');
define('SMTP_PASSWORD', '#####');
#end SMTP settings
?>
