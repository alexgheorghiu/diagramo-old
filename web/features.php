<?php
$title = "Features | Diagramo";
$description = $title;

$key = explode(" ", $description);
$keywords = trim($key[0]);
for ($i = 1; $i < count($key); $i++) {
    $keywords .= "," . trim($key[$i]);
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
        <link rel="shortcut icon" type="image/x-icon" href="./assets/images/favicon.ico"/>
        
        <style>
            .feature_section {
                margin-left:  auto; margin-right: auto; 
                /*border: 1px solid blue;*/
            }
            
            .feature_left {
                width: 150px; 
                /*border: 1px solid red; */
                display: table-cell;
                text-align: center;
            }
            
            .feature_right{
                /*border: 1px solid green;  */
                display: table-cell; vertical-align: top; margin-right: auto;
            }
            
            .spacer {
                margin-top:  20px;                
            }
            
            .gray_line {
                border: 0;
                border-bottom: 1px dotted gray;
            }
            
            .feature_title {
                color: #50B1D2;
            }
        </style>
    </head>

    <body>

        <? include "header.php"; ?>

        <h1>Main features</h1>

        <div class="content">

            <div class="feature_section">
                <div class="feature_left">
                    <img src="assets/images/feature-html5.gif" border="0" alt=""/>
                </div>
                <div class="feature_right">
                    <h2 class="feature_title">Pure HTML 5</h2>
                    Diagramo was built ONLY on HTML5. No Flash, no Java or other plugins. 
                </div>                                                
            </div>
            
<!--            <hr class="gray_line"/>
            <p class="spacer"/>
            
            <div class="feature_section">
                <div class="feature_left">
                    <img src="assets/images/feature-server.gif" border="0" alt=""/>
                </div>
                <div class="feature_right">
                    <h2 class="feature_title">Deploy it on your server</h2>
                    Do you want the diagrams to sit on your server?  
                    <p/>
                    All you need is a <img src="assets/images/php.gif" style="vertical-align: middle;" alt="PHP"> (PHP)
                        and a <img src="assets/images/mysql.gif" style="vertical-align: middle;" alt="MySQL"> (MYSQL) database.
                    <p/>
                    The web installer wizard will make the installation a breeze.
                </div>                                                
            </div>-->

            <hr class="gray_line"/>
            <p class="spacer"/>
            
            <div class="feature_section">
                <div class="feature_left">
                    <img src="assets/images/feature-collaborate.png" border="0" alt=""/>
                </div>
                <div class="feature_right">
                    <h2 class="feature_title">Collaborate</h2>
                    Share diagrams with other teammates.
                </div>                                                
            </div>
            
<!--            <hr class="gray_line"/>
            <p class="spacer"/>
            
            <div class="feature_section">
                <div class="feature_left">
                    <img src="assets/images/feature-lego.jpg" border="0" alt=""/>
                </div>
                <div class="feature_right">
                    <h2 class="feature_title">Customize it</h2>
                    Do you need to extend the application? Add new features? Tune to your needs? <br/>
                    <a href="./customize.php">Get the sources</a> , they are public. They are available under
                    Diagramo Free License.
                    <p/>
                    All you need is some JavaScript knowledge and you are good to go.<br/>
                    <img src="assets/images/feature-custom.gif" style="margin-left: 50px; margin-top: 20px;"  border="1" alt=""/>
                </div>                                                
            </div>-->

            <hr class="gray_line"/>
            <p class="spacer"/>
            
            <div class="feature_section">
                <div class="feature_left">
                    <img src="assets/images/feature-svg.gif" border="0" alt=""/>
                </div>
                <div class="feature_right">
                    <h2 class="feature_title">Export to SVG, Gif and JPEG</h2>
                    You can export diagrams in SVG, Gif of JPEG format.
                </div>                                                
            </div>
            
            <hr class="gray_line"/>
            <p class="spacer"/>
            
            <div class="feature_section">
                <div class="feature_left">
                    <img src="assets/images/feature-share.jpg" border="0" alt=""/>
                </div>
                <div class="feature_right">
                    <h2 class="feature_title">Share diagrams with world</h2>
                    You can share a diagram with <a href="http://en.wikipedia.org/wiki/Permalink" target="new">permalinks</a>. Just give the link to someone and she will see that diagram.
                </div>                                                
            </div>
            
<!--            <hr class="gray_line"/>
            <p class="spacer"/>
            
            <div class="feature_section">
                <div class="feature_left">
                    <img src="assets/images/feature-free.jpg" border="0" alt=""/>
                </div>
                <div class="feature_right">
                    <h2 class="feature_title"><a name="free">Free sources</a></h2>
                    - They are FREE ? For me? <br/>
                    - Yes, they are. <a href="./customize.php">Here</a> <br/>
                    - But, but....why? <br/>
                    - Well, we will not live forever...so in case a cataclysm will wipe all developers you can still have access to the code. <br/>
                    You will be the last in human kind to continue the development of Diagramo (remember ! it's your duty)...so instead of searching for food or shelter you will
                    need to learn JavaScript and HTML5.
                </div>                                                
            </div>-->

        </div>

        <? include "footer.php"; ?>

    </body>
</html>