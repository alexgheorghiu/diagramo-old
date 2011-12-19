<?php
/**This file simply seach the /lib/sets folder and try to load all the figure sets
 */
?>
<script language = "javascript1.2" type="text/javascript">
    var figureSets = [];
</script>
<?
$dirName = dirname(__FILE__);
$files = scandir($dirName);

foreach($files as $file){
    if($file != '.' && $file != '..'){
//        if(in_array($file, array('network', 'experimental')) ){ //skip this as experimental
//            continue;
//        }
        
        $fullPath = $dirName . '/' . $file;
        if(is_dir($fullPath)){
            echo '<script language = "javascript1.2" type="text/javascript" src="lib/sets/' . $file . '/' . $file.'.js"></script>' . "\n";
        }
    }
}
?>
