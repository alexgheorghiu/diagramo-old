<?php

/**
 * @see http://xmlgraphics.apache.org/batik/tools/rasterizer.html
 */
$t1 = microtime ();

$exportType = 'pdf'; //Can be jpg | png | pdf

$folder = dirname(__FILE__);

//Fake SVG file
$data = '<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
    "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
         width="200" height="200"
         viewBox="0 0 200 200"  >

    <path d="M100,100 A25 25 0 0 0 150 100" stroke="lightgreen" stroke-width="4" fill="none" />


</svg>';

//Generate an unique SVG file into the system's temporary folder
$ui = uniqid();
$tempSVG = sys_get_temp_dir() . $ui . '.svg';

//Write SVG to file
print "\n$tempSVG";
$handle = fopen($tempSVG, "w");
fwrite($handle, $data);
fclose($handle);


//Convert SVG to raster image
#$output = `java -jar batik-rasterizer.jar arcs.svg`;
//mime type can be image/png, image/jpeg, image/tiff or application/pdf
$tempExp = '';
$command = '';
switch ($exportType) {
    case 'jpg':
        $tempExp = $folder . "/" . $ui . '.jpg';
        $command = sprintf('java -jar batik-rasterizer.jar -m image/jpeg -q .99 %s -d %s', $tempSVG, $tempExp);
        break;
    case 'tiff':
        exit("Tiff not implemented");
        break;
    case 'pdf':
        $tempExp = $folder . "/" . $ui . '.pdf';
        $command = sprintf('java -jar batik-rasterizer.jar -m application/pdf %s -d %s', $tempSVG, $tempExp);
        break;
    case 'png': //flow to default
    default:
        $tempExp = $folder . "/" . $ui . '.png';
        $command = sprintf('java -jar batik-rasterizer.jar -m image/png -q .99 %s -d %s', $tempSVG, $tempExp);
}

print "\n$tempExp";
print "\n$command";
$output = shell_exec($command);
print "\n$output";


//Delete the temporary files file
unlink($tempSVG);
#unlink($tempExp);

$t = microtime() - $t1;
print "\nTime: $t microseconds";
?>
