<?php
require_once dirname(__FILE__) . '/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}



$delegate = new Delegate();
$publicDiagrams =  $delegate->diagramdataGetAllPublic();

?>

<!DOCTYPE html>
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title>Public diagrams</title>
        <link rel="stylesheet" media="screen" type="text/css" href="assets/css/style.css" />
    </head>
    <body>
        <? //require_once dirname(__FILE__) . '/header.php'; ?>
        
        <div id="content" style="text-align: center; margin-left: auto; margin-right: auto;">
            <? require_once dirname(__FILE__) . '/common/messages.php'; ?>
            <br/>
            
           
            
            <!--My diagrams-->
            <div style="margin-left: 100px; margin-right: 100px;">
                <h3>Public diagrams</h3>
                <hr/>
                
                    
                    
                    <!--Data-->
                    <? for ($i=0; $i < count($publicDiagrams); $i++) {
                         $myDiagram = $publicDiagrams[$i];
                        //$svgLink = $url . '/diagram/' . $myDiagrams->hash . '.svg';
                        $svgLink = './expoThumb.php?hash=' . $myDiagram->hash;
                    ?>
                    <div style="display: table-cell; padding: 5px;">
                        <a href="./expoThumb.php?hash=<?=$myDiagram->hash?>">
                        <img style="background-color: white; border: 1px solid #CCCCCC;" width="200" height="200" src="<?=$svgLink?>"/>
                        </a>
                    </div>                                            
                    <? } ?>
            </div>

            
        </div>
                
    </body>
</html>
