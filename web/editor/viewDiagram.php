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
        <title><?$diagram->title?></title>
        <link rel="stylesheet" media="screen" type="text/css" href="http://<?=WEBADDRESS?>/assets/css/style.css" />
    </head>
    <body>
        <h1><?=$diagram->title?></h1>
        <div><?=$diagram->description?></div>
        <p/>
        <div id="container">
            <object type="image/svg+xml" data="/<?=sanitize($diagram->title)?>_<?=$diagram->hash?>.svg" width="800" height="600">
                <img src="/<?=sanitize($diagram->title)?>_<?=$diagram->hash?>.png" width="800" height="600" border="1"/>
            </object>
            
        </div>
        <div>
            <a href="/<?=sanitize($diagram->title)?>_<?=$diagram->hash?>.svg">Download SVG</a> | 
            <a href="/<?=sanitize($diagram->title)?>_<?=$diagram->hash?>.png">Download PNG</a> |
            <a href="/<?=sanitize($diagram->title)?>_<?=$diagram->hash?>.jpg">Download JPG</a>
        </div>

    </body>
</html>