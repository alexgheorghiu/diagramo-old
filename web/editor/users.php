<?php
/**Colaborators are per diagram*/

require_once dirname(__FILE__) . '/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

require_once dirname(__FILE__) . '/common/rememberme.php';

if ( !isset($_SESSION['userEmail']) ) {
    addError("Access denied");
    redirect('./index.php');
}




$delegate = new Delegate();

$loggedUser = Delegate::userGetByEmail($_SESSION['userEmail']);
$users = $delegate->userGetAll();

$page = 'users';

//$rawLicense = $delegate->settingsLoadNative('LICENSE');
$l = new License();
$l->load($rawLicense);

?>

<!DOCTYPE html>
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title>Users - Diagramo</title>
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <link rel="stylesheet" media="screen" type="text/css" href="assets/css/style.css" />
        <script type="text/javascript" src="./assets/javascript/dropdownmenu.js?<?=time()?>"></script>    
        <script type="text/javascript">
            function confirmation(message){
                var answer = confirm(message);
                if(answer){
                    return true;
                }

                return false;
            }
            
            
        </script>
        
        <script type="text/javascript" src="./assets/javascript/dropdownmenu.js?<?=time()?>"></script>    
        <script type="text/javascript" src="./lib/browserReady.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/log.js?<?=time()?>"></script>
    </head>
    <body>
        <? require_once dirname(__FILE__) . '/header.php'; ?>

        <div id="content" style="text-align: left; /*border: solid 1px red;*/ padding-left: 100px;">
            <? require_once dirname(__FILE__) . '/common/messages.php'; ?>
            <br/>

            <?if(false /*!$l->checkLicense()*/ ){ ?>    
                <div>
                    <div style="margin: 10px auto; width: 600px;">
                        This feature is disable in free version. 
                        <p/>
                        Please <a href="./license.php"><img style="vertical-align: middle;" src="assets/images/upgrade-button.png" /></a> to be enable these feature.
                    </div> 
                </div>            
            <?} else if(false /*$l->host != $_SERVER['HTTP_HOST']*/) {?>
                <div style="margin: 10px auto; width: 600px;">
                    License host (<?=$l->host?>) is wrong. 
                    <p/> 
                    Please <a href="./license.php"><img style="vertical-align: middle;" src="assets/images/upgrade-button.png" /></a> to be enable these feature.
                </div>            
            <?} else {?>
                <!--Collaborators-->
                <?if(count($users) > 0 ){?>
                <div class="form"  style="width: 600px;">
                    <div class="formTitle" >
                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td width="400"><span class="formLabel" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">Users</span></td>
                                <td colspan="2">&nbsp;</td>
                            </tr>
                        </table>
                    </div>

                    <table border="0" width="100%">
                        <tr>
                            <td><span class="formLabel">Email</span></td>
                            <td align="center"><span class="formLabel">Remove user</span></td>
                        </tr>
                        <?foreach($users as $user){                        
                        ?>
                        <tr>
                            <td align="center">
                                <?=$user->email?>
                            </td>

                            <td align="center">
                                <? if($user->email == $_SESSION['userEmail']){?>
                                    N/A
                                <?}else{?>                            
                                    <a onclick="return confirmation('Are you sure you want to remove the collaborator?');" href="./common/controller.php?action=removeUser&userId=<?=$user->id?>"><img style="vertical-align:middle; margin-right: 3px;" src="./assets/images/remove.gif" border="0" width="24" height="24"/></a>                        
                                <?}?>
                            </td>
                        </tr>
                        <?}?>
                    </table>
                </div>            
                <?}else{?>
                    No users to manage
                <?}?>
                <!--End collaborators-->


                <p/>

                <!--Invite known people-->

                <div class="form"  style="width: 600px;">
                    <div class="formTitle" >
                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td width="400"><span class="formLabel" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">Invite known people to diagram</span></td>
                                <td colspan="2">&nbsp;</td>
                            </tr>
                        </table>
                    </div>

                    <form action="./common/controller.php" method="POST" onsubmit="alert('Not implemented.'); return false;">
                        <input type="hidden" name="action" value="addUserExe"/>
                        <label for="email">Email</label><br/>
                        <input type="text" name="email" id="email" /><br/>
                        <label for="password">Password</label><br/>
                        <input type="text" name="password" id="password" /><br/>                    
                        <input type="submit" value="Add"/>
                    </form>
                </div>

                <!--End add collaborator-->




                <p/>
    <!--            <div class="form"  style="width: 600px;">
                    <a href="./editor.php?diagramId=<?=$_REQUEST['diagramId']?>">back to diagram</a>
                </div>-->
            
            <?}?>
        </div>
        

    </body>
</html>
