<?php
$title = "Diagram catalog | Diagramo";
$description = $title;

$key = explode(" ", $description);
$keywords = trim($key[0]);
for ($i = 1; $i < count($key); $i++) {
    $keywords .= "," . trim($key[$i]);
}

require_once dirname(__FILE__) . '/editor/common/delegate.php';

define('ROWS', 2);
define('COLS', 2);

$diagramsPerPage = ROWS * COLS;

$d = new Delegate();

$nrOfPublicDiagrams = $d->diagramCountGetAllPublic();
$page = 0;

if(is_numeric($_REQUEST['page'])){
    $page = intval($_REQUEST['page']);
}

$publicDiagrams = $d->diagramGetPublic(ROWS * COLS * $page, ROWS * COLS * ($page + 1) );

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

        <h1>Public diagrams</h1>

        <div class="content">
            <table border="0" width="100%" cellspacing="2">
                <tr>
                    <!--Navigation start-->
                    <td colspan="<?=COLS?>" style="text-align: right;" >
                        <?if( $page > 0 ){?>
                        <a href="./catalog.php?page=<?=($page-1)?>">previous</a>
                        <?}?>
                        
                        <form style="display: inline;" action="./catalog.php" method="GET">
                            <select onchange="this.form.submit()" name="page">
                                <?for($p = 0; $p < ceil($nrOfPublicDiagrams / $diagramsPerPage); $p++){ ?>
                                <option value="<?=$p?>" <?= $p==$page?'selected':'' ?> ><?=($p + 1)?></option>
                                <?}?>
                            </select>
                        </form>
                        
                        <?if( $page < ceil($nrOfPublicDiagrams / $diagramsPerPage) - 1 ){?>
                        <a href="./catalog.php?page=<?=($page+1)?>">next</a>
                        <?}?>
                    </td>                    
                    <!--End Navigation start-->
                </tr>
                <?for($i=0;$i<ROWS; $i++){?>
                <tr>
                    <?for($j=0;$j<COLS; $j++){
                        $publicDiagram = $publicDiagrams[$i * COLS + $j];
                    ?> 

                    <td style="text-align: center;">
                        <?if(is_object($publicDiagram)){?>


                            <a style="text-decoration: none;" href="/<?=sanitize($publicDiagram->title)?>_<?=$publicDiagram->hash?>.html" target="_blank">
                                <img src="/<?=sanitize($publicDiagram->title)?>_<?=$publicDiagram->hash?>.svg" width="200" height="200" border="1"/><br/>
                                <?=$publicDiagram->title?> 
                            </a>

                        <?}else{?>
                            &nbsp;                    
                        <?}?>
                    </td>
                   <?}?>
                </tr>
                <?}?>
                <tr>
                    <!--Navigation start-->
                    <td colspan="<?=COLS?>" style="text-align: right;" >
                        <?if( $page > 0 ){?>
                        <a href="./catalog.php?page=<?=($page-1)?>">previous</a>
                        <?}?>
                        
                        <form style="display: inline;" action="./catalog.php" method="GET">
                            <select onchange="this.form.submit()" name="page">
                                <?for($p = 0; $p < ceil($nrOfPublicDiagrams / $diagramsPerPage); $p++){ ?>
                                <option value="<?=$p?>" <?= $p==$page?'selected':'' ?> ><?=($p + 1)?></option>
                                <?}?>
                            </select>
                        </form>
                        
                        <?if( $page < ceil($nrOfPublicDiagrams / $diagramsPerPage) - 1 ){?>
                        <a href="./catalog.php?page=<?=($page+1)?>">next</a>
                        <?}?>
                    </td>                    
                    <!--End Navigation start-->
                </tr>
            </table>
        </div>

        <? include "footer.php"; ?>

    </body>
</html>
