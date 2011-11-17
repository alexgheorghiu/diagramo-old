<?php
include "./editor/common/verbose.php";


if (!isset($_SESSION)) {
    session_start();
}

$title = "Diagram software | Diagram tool | Diagram editor";
$description = "Online diagram software | Online diagram tool | Online diagram editor";

$key = explode(" ", $description);
$keywords = trim($key[0]);
for ($i = 1; $i < count($key); $i++){
    $keywords .= "," . trim($key[$i]);
}

?>


<!DOCTYPE html>
<html>
    <head>
        <title><? echo $title; ?></title>
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <meta name="description" content="<? echo $description; ?>" />
        <meta name="keywords" content="<? echo $keywords; ?>" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="author" content="http://diagramo.com" />
        <meta name="language" content="en-us" />
        <meta name="robots" content="index,follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <meta name="google-site-verification" content="aLEmsWT6tbza_VkM41MXv2XdfRmkw3FexD1ZQfGlfwE" />
        <link rel="stylesheet" type="text/css" href="./assets/css/style.css" />        
		
        <script type="text/javascript" src="./assets/javascript/jquery-1.4.2.min.js"></script>
        <script type="text/javascript" src="./assets/javascript/fancyzoom.min.js"></script> 
        <script type="text/javascript"> 
            function resize(){
                //do nothing
                //alert('Who disclaimer is?');
            }
            
            $(document).ready(function() {
                    $('#video_link').fancyZoom();
                    $(window).bind('resize', function() { 
                         resize();
                        });
                    });
        </script>
        
        <style type="text/css">
            .feature {
                float: left; margin-right: 5px;
                border: none;
            }
            
            .slide {
                position: absolute; top: 15px; left: 20px;
                width: 450px;
                display: none;
                /*border: 1px solid red; */
                text-align: left;
                color: white;
                font-size: 16px;
            }
            
            .disk {
                border: 0;
            }
            
            .slide a {
                color: white;
            }
            
        </style>
        
        <script type="text/javascript">            
            
            var slides = ['unu', 'doi', 'trei', 'patru'];
            var slideIndex = 0;
            
            function run(){
                slide(slideIndex);                
                slideIndex = (slideIndex + 1) % slides.length;
                setTimeout(run, 2000);                
            }
            
            function slide(index){
                slideIndex = index; //in case user clicked the disk
                
                              
                for(var i=0; i<slides.length; i++){
                    //hide other slides
                    var tSlide = document.getElementById('slide_' + i);
                    tSlide.style.display = 'none';
                    
                    //reset images
                    var img = document.getElementById('img_' + i);
                    img.src = "./assets/images/slides/white-disk.png";
                }
               
                
                //change current image
                var img = document.getElementById('img_' + index);
                img.src = "./assets/images/slides/gray-disk.png";
                
                //change current slide
                var slide = document.getElementById('slide_' + index);
                slide.style.display = 'block';
            }
                        
        </script>
		
        <link rel="shortcut icon" type="image/x-icon" href="./assets/images/favicon.ico"/>
    </head>

    <body onload="run();">

    <? include "header.php"; ?>

    <div class="header">

        <!--Video-->
        <div class="slide" style="display: block;" id="slide_0">
            <a href="#video" id="video_link">
                <img src="./assets/images/stacked-diagrams.png" border="0"/>
            </a>            
            
        </div>
        
        <!--Interview MIT-->
        <div class="slide" style="display: none;" id="slide_1">
            <h2>Why did MIT pick Diagramo?</h2>
            <div>
                <img style="vertical-align: middle;" src="./docs/interviews/mit/mit-logo.gif" />'s research lab                
                picked Diagramo to build their next generation visual IDE.
                <p/>
                <img src="./docs/interviews/mit/thumb2.gif" style="border: 0;" height="100"/>                
                &nbsp;&nbsp;
                <img src="./docs/interviews/mit/thumb.gif" style="border: 0;" height="100"/>
                <hr/>
                Read <a href="./docs/interviews/mit/interview.php">here</a> the short interview.
            </div>
        </div>
        
        <!--Interview IPscape-->
        <div class="slide" style="display: none;" id="slide_2">
            <h2>Why did IPScape pick Diagramo?</h2>
            <div>
                See why <!-- <img style="vertical-align: middle;" src="./docs/interviews/ipscape/logo.jpg"/> --> IPscape picked Diagramo
                and what they built based on it.
                <p/>
                <img src="./docs/interviews/ipscape/thumb.gif" style="border: 0;" height="100"/>
                &nbsp;&nbsp;
                <img src="./docs/interviews/ipscape/thumb2.gif" style="border: 0;" height="100"/>
                <hr/>
                Read <a href="./docs/interviews/ipscape/interview.php">here</a> the short interview.
            </div>
        </div>
        
        <!--OSCON-->
        <div class="slide" style="display: none;" id="slide_3">
            <h2>Diagramo was present at OSCON 2011</h2>
            <div>                
                Yes, we were there. Strong geeks = nice event.<br/>
                We presented real implementation of HTML5 features in Diagramo <br/>
                <div style="text-align: center;">
                    <img src="./docs/interviews/oscon/logo.png" width="100" height="100"/>
                </div>
                <hr/>
                See <a href="http://blog.diagramo.com/2011/07/slides-oscon-bird-of-feather.html">the slides</a> we presented.
            </div>
        </div>

        <!--Navigation disks-->
        <div style="position: absolute; /*border: 1px solid white;*/ top: 270px; left: 150px; font-size: 24px; font-family: Arial; color: white;">
            <a onclick="slide(0);" href="javascript:void(0);"><img id="img_0" class="disk" src="./assets/images/slides/gray-disk.png"/></a>
            <a onclick="slide(1);" href="javascript:void(0);"><img id="img_1" class="disk" src="./assets/images/slides/white-disk.png"/></a>
            <a onclick="slide(2);" href="javascript:void(0);"><img id="img_2" class="disk" src="./assets/images/slides/white-disk.png"/></a>
            <a onclick="slide(3);" href="javascript:void(0);"><img id="img_3" class="disk" src="./assets/images/slides/white-disk.png"/></a>
        </div>
        
        <div style="position: absolute; /*border: 1px solid white;*/ top: 15px; left: 500px; font-size: 24px; font-family: Arial; color: white;">
            What is Diagramo?
        </div>
        
		
        <div class="header-text">
            It's an online diagram editor made in pure <a style="color: white;" href="http://en.wikipedia.org/wiki/HTML5" target="_new">HTML5</a>
            <br/>
            <img src="./assets/images/white-check.png" border="0" />It's FREE<br/>
            <img src="./assets/images/white-check.png" border="0" />Share and collaborate<br/>
            <img src="./assets/images/white-check.png" border="0" />Export to SVG, Gif and JPEG<br/>
        </div>
        
        <!--Action buttons-->
        <div style="position: absolute; top: 230px; width: 300px; right: 170px; white-space: nowrap;  /*border: 1px solid magenta;*/ ">
            <a href="/editor/editor.php">
                <img src="./assets/images/try-now-button.png" border="0"/>
            </a>
            &nbsp;&nbsp;&nbsp;
            <a href="/editor/login.php">
                <img src="/assets/images/login-button.png" border="0"  />
            </a>
        </div>
        <!--End Action buttons-->

    </div>

    <!--videolightbox--> 
        <div id="video">
        <object width="800" height="500">
            <param name="movie" value="http://www.youtube.com/v/wADduhofRuY?hl=en&fs=1"></param>
            <param name="allowFullScreen" value="true"></param>
            <param name="allowscriptaccess" value="always"></param>
            <embed src="http://www.youtube.com/v/wADduhofRuY?hl=en&fs=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="800" height="500">                
            </embed>
        </object>
        </div> 
        <!--videolightbox--> 

    <div class="content">
        
        
        
        <div class="column">  
            <!--HTML5-->
            <img src="./assets/images/feature-html5.gif" class="feature"/>
            <b>HTML5</b><br/>
                Based ONLY on HTML5. No Flash, no Java or other plugins.
        </div>


        <div class="column">
            <!--Collaborate-->
            <img src="./assets/images/feature-collaborate.png" class="feature"/>
            <b>Share and collaborate </b><br/>
            Share diagrams with other teammates. Or make them public if you want.
        </div>

        <div class="column" style="margin-right:0;">
            <!--Export-->
            <img src="./assets/images/feature-svg.gif" class="feature"/>
            <b>Export to SVG, Gif and JPEG</b><br/>
            You can export diagrams in SVG, Gif of JPEG format.
        </div>
        
    </div>


    <? include "footer.php"; ?>

    </body>
</html>
