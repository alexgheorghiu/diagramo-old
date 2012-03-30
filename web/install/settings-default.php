<?php

/*WEBADDRESS points the URL where application is installed.
 *It is used mainly by the email engine or cron script to add proper back links
 *to the application.
 */

//where diagrams will be stored
define('STOREFOLDER','/diagrams'); //no trailing slashes

define('DIAGRAMO', 'http://diagramo.com'); //no trailing slashes
define('WEBADDRESS', '##_WEBADDRESS_##'); //no trailing slashes
define('WEBADDRESS_SSL', '##_WEBADDRESS_SSL_##'); //no trailing slashes


#database settings
// The database server address.  Example: localhost, localhost:3306 or 87.230.14.9
#define('DB_ADDRESS', '10.0.0.149');
define('DB_ADDRESS', '##_DB_ADDRESS_##');


//The database name. Example: diagramo
define('DB_NAME', '##_DB_DBNAME_##');

//The database user. Example: diagramo or root
define('DB_USER_NAME', '##_DB_USERNAME_##');

/*The database user's password, in case it is present. In case you do not have a
password (localhost & root access) just use '' (empty) value.
 * Ex: define('DB_USER_PASS', '');
 */
define('DB_USER_PASS', '##_DB_PASSWORD_##');

/**Store the version of the editor. Usefull in bugs and software update*/
define('VERSION', '2.2alfa');


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
