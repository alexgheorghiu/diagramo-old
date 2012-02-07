<?php
include('start.php');
include('checkinstall.php');
include('util.php');
#include('../common/settings-default.php');

define('STEP', 'step3');

#we need to redirect to server

$fullURL = selfURL();
$appUrl = substr($fullURL, 0, strpos($fullURL, '/install'));

$errors = array();

//Try to do server side only if the form on the page was submited (action = verify)
if(isset ($_REQUEST['action']) && $_REQUEST['action'] == 'verify'){
    $passed = true;
    
    //test again for settings.php
    if(is_file("../editor/common/settings.php")){
        $errors[] = 'File settings.php already present. Please delete it to continue with installation.';
        $passed = false;
    }
    
    //test database connection
    if(empty($_REQUEST['dbhost'])){
        $errors[] = 'Database host can not be empty';
        $passed = false;
    }
    
    if(empty($_REQUEST['dbname'])){
        $errors[] = 'Database name can not be empty';
        $passed = false;
    }
    
    if(empty($_REQUEST['dbuser'])){
        $errors[] = 'Database user name can not be empty';
        $passed = false;
    }
    
    if( !@mysql_connect(trim($_REQUEST['dbhost']), trim($_REQUEST['dbuser']), trim($_REQUEST['dbuserpass']) ) ){
        $errors[] = 'Could not connect to MySQL server';
        $passed = false;
    }
    
    if(!@mysql_select_db(trim($_REQUEST['dbname']))){
        $errors[] = 'Could not use ' . $_REQUEST['dbname'] . ' database';
        $passed = false;
    }    
    
    
    //test master admin login
    if(empty($_REQUEST['admin_name'])){
        $errors[] = "Administrator's name can not be empty";
        $passed = false;
    }
    if(empty($_REQUEST['admin_email'])){
        $errors[] = "Administrator's email can not be empty";
        $passed = false;
    }
    if(empty($_REQUEST['admin_pass'])){
        $errors[] = "Administrator's password can not be empty";
        $passed = false;
    }
    
    
    //Create settings.php
    if(count($errors) == 0){
        $settingsDefaultFile = "./settings-default.php";
        $settingsFile = "../editor/common/settings.php";

        // Open and read default settings
        $handle = fopen($settingsDefaultFile, 'r');
        $settingsContent = fread($handle, filesize($settingsDefaultFile));
        fclose($handle);

        // Open and read settings
        fopen($settingsFile, 'w');

        //WEBADDRESS
        $settingsContent = str_ireplace("##_WEBADDRESS_##", trim($appUrl), $settingsContent);
        
        $sslAppUrl = str_replace('http', 'https', $appUrl);
        $settingsContent = str_ireplace("##_WEBADDRESS_SSL_##", trim($sslAppUrl), $settingsContent);
        
        // SQL Settings
        $settingsContent = str_ireplace("##_DB_ADDRESS_##", trim($_REQUEST['dbhost']), $settingsContent);
        $settingsContent = str_ireplace("##_DB_USERNAME_##", trim($_REQUEST['dbuser']) , $settingsContent);
        $settingsContent = str_ireplace("##_DB_PASSWORD_##", trim($_REQUEST['dbuserpass']), $settingsContent);
        $settingsContent = str_ireplace("##_DB_DBNAME_##", trim($_REQUEST['dbname']), $settingsContent);

        $handle = fopen($settingsFile, 'w');
        if (fwrite($handle, $settingsContent) == false) {
            $errors[] = 'Could not create settings.php file';
        }
        fflush($handle);
        fclose($handle);
    }
    //end create settings file

    
    //Insert Company and Root into the database
    if(count($errors) == 0){
        //create tables
        $commands = getSQLCommands('./sql/create-tables.sql');
        $connectionDb = @mysql_connect( trim($_REQUEST['dbhost']), trim($_REQUEST['dbuser']), trim($_REQUEST['dbuserpass']) );
        $selectDb = @mysql_select_db( trim($_REQUEST['dbname']) );
        foreach($commands as $command){
            mysql_query($command, $connectionDb);
            print($command . "<p/>\n");
        }

        #exit();
        
        //add add admin
        $userSQL = sprintf("insert into `user` (`email`, `password`, `name`, `createdDate`)" 
            . "values('%s', '%s', '%s', '%s')",  
                trim($_REQUEST['admin_email']),
                md5(trim($_REQUEST['admin_pass'])),
                addslashes(trim($_REQUEST['admin_name'])),
                now()
                );
        mysql_query($userSQL, $connectionDb);
        
    }
    //end insert Company and Root into the database
    
    
    #exit();
    
    if(count($errors) == 0){
        header('Location: ./step4.php');
        //header(sprintf('Location: %s/scriptStep4.php', ABC_SERVER));
    }
}
?>

<!DOCTYPE HTML>
<html>
    <head>
        <title>Step 3 - Settings | Diagramo</title>
        <link href="./assets/style.css" rel="stylesheet" type="text/css" />
        <script  language="JavaScript" type="text/javascript">            
            /**Detect browser's offset
             *@author Alex Gheorghiu <alex@scriptoid.com>
             **/    
            function getBrowserTimezone() {
                var curdate = new Date()

                var browserOffset = (-curdate.getTimezoneOffset()/60);

                return browserOffset;
            }
            
            /**Set up the browser's timezone for Company Time zone*/
            function defaultTimezome(){
                var timezoneSelect = document.getElementById('timezone');
                var tz = getBrowserTimezone();
                for(var i=0;i<timezoneSelect.length; i++){
                    if(timezoneSelect.options[i].value == tz){
                        timezoneSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            
            /**Trigger a submit of the form*/
            function submitSettingsForm(){
                document.forms['settingsForm'].submit();
            }
        </script>
        <style type="text/css">
            .bigger {
                font-family: sans-serif;
                font-size: 18px;
                font-weight: bold;
                color: #009933;
            }

            
        </style>
    </head>
    <body>

        <div id="content">
            <?php include 'logo.php'?>
            <?php include 'breadcrumb.php' ?>
            <div id="main">
                <?if(count($errors) > 0){?>
                <div style="margin: 5px auto; width: 500px;" >
                    <?
                    foreach($errors as $error){
                        print('<div class="error">' . $error . '</div>');
                    }
                    ?>
                </div>
                <?}?>
                <form action="step3.php" name="settingsForm" method="post">
                    <input type="hidden" name="action" value="verify"/>
                    <table align="center" cellpadding="3" cellspacing="2" border="0">
                                                
                        <!--Database-->
                        <tr align="left">
                            <td class="bigger">Database connection</td>
                        </tr>

                        <tr>
                            <td>
                                <table align="center">

                                    <tr>
                                        <td>Database host:</td>
                                        <td>&nbsp;&nbsp;</td>
                                        <td><input type="text" name="dbhost" value="<?=$_REQUEST['action'] == 'verify' ? $_REQUEST['dbhost'] : 'localhost'?>" /><span class="required">*</span></td>
                                    </tr>

                                    <tr>
                                        <td>Database name:</td>
                                        <td>&nbsp;&nbsp;</td>
                                        <td><input type="text" name="dbname" value="<?=$_REQUEST['dbname']?>" /><span class="required">*</span></td>
                                    </tr>

                                    <tr>
                                        <td>Username:</td>
                                        <td>&nbsp;&nbsp;</td>
                                        <td><input type="text" name="dbuser" value="<?=$_REQUEST['dbuser']?>" /><span class="required">*</span></td>

                                    </tr>

                                    <tr>
                                        <td>Password:</td>
                                        <td>&nbsp;&nbsp;</td>
                                        <td><input type="password" name="dbuserpass" value="<?=$_REQUEST['dbuserpass']?>" /></td>
                                    </tr>
                                </table>
                            </td>

                        </tr>
                                                

                        <!-- -->

                        <tr align="left">
                            <td class="bigger">Administrator account</td>
                        </tr>

                        <tr>
                            <td>

                                <table align="center">

                                    <tr>
                                        <td>Admin name:</td>
                                        <td>&nbsp;&nbsp;</td>
                                        <td><input type="text" name="admin_name" value="<?=$_REQUEST['admin_name']?>" /><span class="required">*</span></td>
                                    </tr>

                                    <tr>
                                        <td>Admin email:</td>
                                        <td>&nbsp;&nbsp;</td>
                                        <td><input type="text" name="admin_email" value="<?=$_REQUEST['admin_email']?>" /><span class="required">*</span></td>
                                    </tr>

                                    <tr>
                                        <td>Admin password:</td>
                                        <td>&nbsp;&nbsp;</td>
                                        <td><input type="password" name="admin_pass" value="<?=$_REQUEST['admin_pass']?>" /><span class="required">*</span></td>

                                    </tr>

                                </table>
                            </td>
                        </tr>                        

                        <tr>
                            <td colspan="4">
                                <span class="required">*</span> mandatory fields</td>
                        </tr>

                    </table>
                    <br />
                </form>

            </div>
            <div id="navigator">
                
                <a href="#" onclick="submitSettingsForm(); return false;">
                    <?if(count($errors) > 0){?>
                        <img src="./assets/retry.png" border="0"/>
                    <?}else{?>
                        <img src="./assets/next.png" border="0"/>
                    <?}?>
                </a>
            </div>            
        </div>
    </body>
</html>