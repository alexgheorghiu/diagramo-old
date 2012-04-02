<?php
require_once dirname(__FILE__) . '/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

require_once dirname(__FILE__) . '/common/rememberme.php';

if (!isset($_SESSION['userId']) || !is_numeric($_SESSION['userId'])) {
    addError("Access denied");
    //redirect('./index.php');
}

$delegate = new Delegate();

$loggedUser = $delegate->userGetById($_SESSION['userId']);

$rawLicense = $delegate->settingsLoadNative('LICENSE');

$l = new License();
$l->load($rawLicense);

?>

<!DOCTYPE html>
<html>
    <head>
        <title>Diagramo - manage license</title>
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
        <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
        <link href="./assets/css/style.css" type="text/css" rel="stylesheet"/>
        
        <script type="text/javascript" src="./assets/javascript/dropdownmenu.js?<?=time()?>"></script>    
        <script type="text/javascript" src="./lib/browserReady.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/log.js?<?=time()?>"></script>
    </head>
    <body>
        <div id="page">
            <?require_once dirname(__FILE__) . '/header.php'; ?>
            
            
            <div id="content"  style="text-align: center; background-color: #F6F6F6">
                <?require_once dirname(__FILE__) . '/common/messages.php';?>
                <br/>

                <?if($rawLicense == ''){?>
                <div class="form" style="width: 400px;">
                    <div class="formTitle" >
                        <span class="menuText" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">Settings</span>
                    </div>
                    <div style="text-align: left;">
                        Please copy/paste the license you got in the form bellow.
                        If you do not have a license please <a href="<?=DIAGRAMO?>/buy.php">buy one</a>.<br/>                        
                    </div>
                    
                    <p/>
                    
                    <form action="./common/controller.php" method="post">
                        <input type="hidden" name="action" value="saveLicense"/>
                        <input type="hidden" name="host" value="<?=$_SERVER['SERVER_NAME']?>"/>
                        License<br/>
                        <textarea name="serial" id="serial" cols="30" rows="10"></textarea>
                        <p/>
                        <input type="image" src="./assets/images/save.gif" style="vertical-align: middle;"  value="Save"/>
                    </form>
                </div>
                <?} else {?>
                    Ok, you have a license.
                    <br/>
                    Host: <?=$l->host?>
                    <br/>
                    Serial: <?=$l->serial?>
                <?}?>
            </div>

            <p/>

            <div class="copyright">&copy; <?=date('Y')?> Diagramo</div>
        </div>
    </body>
</html>

