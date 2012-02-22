<?php
require_once dirname(__FILE__) . '/common/delegate.php';



if (!isset($_SESSION)) {
    session_start();
}

if(!isset ($_REQUEST['hash'])){
    echo 'No hash';
    exit();
}

$delegate = new Delegate();
$diagram = $delegate->diagramGetByHash(trim($_REQUEST['hash']));
$authorUserDiagram = $delegate->userdiagramGetByAuthor($diagram->id);
$author = $delegate->userGetById($authorUserDiagram->userId);

//check if diagram is public
if(!is_object($diagram)){
    print "No diagram found";
    exit();
}

if(!$diagram->public){
    print "Diagram is (no longer?) public";
    exit();
}
//end check


//exit("here");
?>

<!DOCTYPE html>
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title><?=$diagram->title?></title>
        <meta name="description" content="<?=$diagram->description?>" />
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <link rel="stylesheet" media="screen" type="text/css" href="http://<?=WEBADDRESS?>/assets/css/style.css" />
    </head>
    <body>
        <div id="content" style="margin-left:  30px;">
            <h1><?=$diagram->title?></h1>
            <div><?=$diagram->description?></div>
            <div>Public under <a href="http://creativecommons.org/licenses/by-sa/3.0/" target="new">Creative Commons (CC-BY-SA 3.0)</a> license.</div>
            <div>Author : <?=displayName($author)?></div>
            <p/>
            <div id="container">
                <img src="/<?=sanitize($diagram->title)?>_<?=$diagram->hash?>.png" width="800" height="600" border="1"/>            
            </div>
            <div>
                <a href="/<?=sanitize($diagram->title)?>_<?=$diagram->hash?>.svg">Download SVG</a> | 
                <a href="/<?=sanitize($diagram->title)?>_<?=$diagram->hash?>.png">Download PNG</a> |
                <a href="/<?=sanitize($diagram->title)?>_<?=$diagram->hash?>.jpg">Download JPG</a>
            </div>
        </div>
    </body>
</html>