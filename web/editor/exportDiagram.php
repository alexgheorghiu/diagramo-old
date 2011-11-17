<?php
require_once dirname(__FILE__) . '/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

require_once dirname(__FILE__) . '/common/rememberme.php';

if (!isset($_SESSION['userId']) || !is_numeric($_SESSION['userId'])) {
    addError("Access denied");
    redirect('./index.php');
}

if(!is_numeric($_REQUEST['diagramId'])){
    print("Wrond Diagram");
    exit();
}

$delegate = new Delegate();

$loggedUser = $delegate->userGetById($_SESSION['userId']);

$diagram = $delegate->diagramGetById($_REQUEST['diagramId']);

$selfUrl = selfURL(); //find full URL to this script
$url = strleft($selfUrl, '/exportDiagram.php'); //find the URL of the application

$svgLink = WEBADDRESS . '/' . sanitize($diagram->title) . '_' . $diagram->hash . '.svg';
$pngLink = WEBADDRESS . '/' . sanitize($diagram->title) . '_' . $diagram->hash . '.png';
$jpgLink = WEBADDRESS . '/' . sanitize($diagram->title) . '_' . $diagram->hash . '.jpg';
?>

<!DOCTYPE html>
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title>Export Diagram - Diagramo</title>
        <link rel="stylesheet" media="screen" type="text/css" href="assets/css/style.css" />
        <script type="text/javascript">
            function confirmation(message){
                var answer = confirm(message);
                if(answer){
                    return true;
                }

                return false;
            }
        </script>
    </head>
    <body>
        <? require_once dirname(__FILE__) . '/header.php'; ?>

        <div id="content" style="text-align: left; /*border: solid 1px red;*/ padding-left: 100px;">
            <? require_once dirname(__FILE__) . '/common/messages.php'; ?>

            <br/>
            <div class="form"  style="width: 600px;">
                <div class="formTitle" >
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="400"><span class="formLabel" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">Export diagram: <?=$diagram->title?></span></td>
                            <td colspan="2">&nbsp;</td>
                        </tr>
                    </table>
                </div>
                
                <h3>As SVG</h3>
                <input type="text" value="<?=$svgLink?>"  style="width: 400px;"/> <br/>
                <a href="<?=$svgLink?>" target="_blank"><?=$svgLink?></a>
                <p/>

                <h3>As PNG</h3>
                <input type="text" value="<?=$pngLink?>" style="width: 400px;"/><br/>
                <a href="<?=$pngLink?>" target="_blank"><?=$pngLink?></a>
                <p/>

                <h3>As JPG</h3>
                <input type="text" value="<?=$jpgLink?>" style="width: 400px;"/><br/>
                <a href="<?=$jpgLink?>" target="_blank"><?=$jpgLink?></a>
                <p/>

                <a href="./editor.php?diagramId=<?=$diagram->id?>">back to edit diagram</a>
            </div>
        </div>

    </body>
</html>
