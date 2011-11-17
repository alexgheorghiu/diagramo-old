<?php
$title = "About | Diagramo";
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
    </head>

    <body>

<? include "header.php"; ?>

        <h1>About</h1>

        <div class="content">
        <p>
        This post (see original post <a href="http://blog.diagramo.com/2010/06/html-5-canvas-and-diagrams.html">here</a>) could be named "<b>How it started</b>" but first it was HTML 5 and then the story unfolds.
        </p>
        <p>
            <span style="font-family: Gill, Helvetica, sans-serif; font-size: 24px;">A</span>ll started back in March 2010 in Rome, Italy. I was there in a vacation with my lady and after a full day visiting interesting museums I wanted a piece of IT.
        </p>
        <p>
        Grabbed my lady netbook and sneak out of the hotel apartment while she was in shower. Went down the stair to the hall, found a cozy couch and start browsing for something interesting.
        </p>
        <p>
        I ended up on <a href="http://www.w3.org/">w3</a> site and from there to <a href="http://www.w3.org/TR/html5/">html 5 specs</a>. Later on I found some interesting stuff you can do with HTML 5 (at canvasdemo) and ended up with the new tag canvas. I was amazed....it was like the first applet or first flash animation I saw...but hey WITHOUT any plugin.
        </p>
        <p>
        Vacation ended and I went back to work. As I'm involved in many projects at the same time I had to make same basic diagrams to explain stuff to people I work with. Every time I had to use Visio or other desktop application.....until the apple bump my head and I said: "Wait a minute mister, why don't we have a browser diagram editor?"
        </p>
        <p>
        From there it's only sweat, blood and hubris. I've made a small 'prototype' and later on Zack joined me to move this to 'proof of concept'. Later on two of my friends (Toni and Augustin) joined me to make a beta release of the application.
        </p>
        <p>
        I'm personally embarrassed by how unpolished the application is at this point but I think it's good way to show people what HTML 5 is capable of. See diagramo.com
        </p>
        <p>    
        So give it a try and let us know how do you like it.

        </div>

<? include "footer.php"; ?>

    </body>
</html>