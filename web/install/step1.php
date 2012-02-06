<?php
include('start.php');
include('checkinstall.php');
define('STEP','step1');

?>
<!DOCTYPE HTML>
<html>
    <head>
        <title>Step 1 - Welcome | Diagramo</title>
        <link href="./assets/style.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
        
        <div id="content">            
            <?php include 'logo.php'?>
            <?php include 'breadcrumb.php'?>
            <div id="main">
                <div style="margin-top: 20px; margin-left: 20px;">
                Welcome to Diagramo installation.
                <p/>
                This wizard will try to install the Diagramo application 
                for you. <br/>
                </div>
            </div>
            <div id="navigator">
                <a href="step2.php"><img src="./assets/next.png" border="0"/></a>
            </div>
        </div>
    </body>
</html>