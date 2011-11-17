<?php

if (!isset($_SESSION)) {
    session_start();
}

header('Content-type: text/xml');
echo '<?xml version="1.0" encoding="UTF-8"?>';

?>

<!--
A simple page to generate the SVG directly into the browser
 - page has to be xhtml
 - content type has to be xml
 - for the JavaScript variables to accept HTML tags we  need to make the <script>'s inner section as CDATA
 - to make string extend on many lines we need to use backslash \ at the end of each line
-->

<html xmlns="http://www.w3.org/1999/xhtml">
    
    <script type="text/javascript">
        var raw = '<?=$_SESSION['svg']?>';
        var e = unescape(raw);
        
        function loadSVG(){
            alert(e);

            var svg = document.getElementById('svg');
            svg.innerHTML = e;
        }
    </script>

    <body onload="loadSVG()">
        <div id="svg"></div>
    </body>
</html>