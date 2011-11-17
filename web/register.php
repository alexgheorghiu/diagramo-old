<?php
require_once dirname(__FILE__) . '/editor/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

$title = "Register | Diagramo";
$description = $title;

$key = explode(" ", $description);
$keywords = trim($key[0]);
for ($i = 1; $i < count($key); $i++) {
    $keywords .= "," . trim($key[$i]);
}

if( isset($_REQUEST['i']) ){
    $d = new Delegate();
    $invitation = $d->invitationGetByToken($_REQUEST['i']);
}
?>

<!DOCTYPE html>
<html>

    <head>
        <title><? echo $title; ?></title>
        <meta name="description" content="<? echo $description; ?>" />
        <meta name="keywords" content="<? echo $keywords; ?>" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="author" content="http://diagramo.com" />
        <meta name="language" content="en-us" />
        <meta name="robots" content="index,follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />

        <link rel="stylesheet" type="text/css" href="./assets/css/style.css" />
    </head>

<body>

<? include "header.php"; ?>

    <h1>Register</h1>

    <div class="content">
    <? require_once './editor/common/messages.php'; ?>
        <form action="/editor/common/controller.php" method="POST">
            <input type="hidden" name="action" value="registerExe"/>            
            
            <?if( is_object($invitation) ){//special case for invitation?>
                <input type="hidden" name="invitationToken" value="<?=$_REQUEST['i']?>"/>            
                Email <span style="color:red">*</span> :<br />
                <input type="text" name="email" class="myinput" value="<?=$invitation->email?>" readonly="readonly" /> <br/><br />
            <?}else{ //normal (no invitation) register?>
                Email <span style="color:red">*</span> :<br />
                <input type="text" name="email" class="myinput" /> <br/><br />
            <?}?>
            
            Password <span style="color:red">*</span> :<br />
            <input type="password" name="password" class="myinput" /> <br/><br />
            
            Password (again) <span style="color:red">*</span> :<br />
            <input type="password" name="password2" class="myinput" /> <br/><br />
            
            <?if(! is_object($invitation) ){ //hide if we come from an invitation?>
                Add the text in image:<br />
                <input type="text" name="captcha" class="myinput"/><br /><br />
                <img src="./editor/common/captcha.php" alt="To see this image use the latest version of any browser."/><br/><br />
            <?}?>
            
            <input type="submit" value="Register" class="mysubmit" />
        </form>
        <p/>
        <span style="color:red">*</span> - mandatory fields
    </div>

    <? include "footer.php"; ?>

    </body>
</html>