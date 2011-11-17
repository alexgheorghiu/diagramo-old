<?php


require_once dirname(__FILE__) . '/common/delegate.php';
//print $_SERVER['REQUEST_URI'];
//print_r($_REQUEST);
//exit;

if (!isset($_SESSION)) {
    session_start();
}

if (!isset($_REQUEST['hash'])) {
    echo 'No hash';
    exit();
}

if(strlen(trim($_REQUEST['hash'])) != 6){
    print "Wrong hash";
    exit();
}

$delegate = new Delegate();
$diagram = $delegate->diagramGetByHash(trim($_REQUEST['hash']));
if(!is_object($diagram)){
    print  "No diagram";
    exit();
}

$diagram = $delegate->diagramGetById($diagram->id);
        
//GUARDIAN: see if we can display this diagram
$display = false;
if ($diagram->public) {
    $display = true;
} else {
    $loggedUser = $delegate->userGetById($_SESSION['userId']); //do we have a logged user
    if (is_object($loggedUser)) {
        $userdiagram = $delegate->userdiagramGetByIds($loggedUser->id, $diagram->id); //is he allocated to this diagram?
        if (is_object($userdiagram)) {
            $display = true;
        }
    }
}
//END GUARDIAN: check display


$type = $_REQUEST['type'];

$nowIsNow = now(); //store time

switch ($type) {
    case 'png':
        //load PNG data
        $pngData = $delegate->diagramdataGetByDiagramIdAndType($diagram->id, Diagramdata::TYPE_PNG);
        #print_r($pngData);

        $convertion = false; //flag to request a new convertion
        if (!is_object($pngData)) { //no PNG file present (at least in DB)
            $convertion = true;
        } else { //PNG exists but is old
            if ($pngData->lastUpdate < $diagram->lastUpdate) {
                $convertion = true;
            }
        }

        #print "Conversion needed: $convertion";
        #exit();

        $svgPath = getStorageFolder() . '/' . $diagram->id . '.svg';
        $pngPath = getStorageFolder() . '/' . $diagram->id . '.png';
        if ($convertion) {
            //convert SVG to PNG
            $batikPath = dirname(__FILE__) . '/exporter';
            
            //Note: Always use "%s" to be able to use white spaces in paths
            $command = sprintf('java -jar "%s"/batik-rasterizer.jar -m image/png -q .99 "%s" -d "%s"', $batikPath, $svgPath, $pngPath);
            #print "Command: $command";
            #exit();
            $output = shell_exec($command);
            #print $command . ':' . $output;
            #exit();
            //end conversion


            $pngFileSize = filesize($pngPath);
            
            //see if we need to create the PNG data (first time)
            if (!is_object($pngData)) { //create
                $pngData = new Diagramdata();
                $pngData->diagramId = $diagram->id;
                $pngData->type = Diagramdata::TYPE_PNG;
                $pngData->fileName = $diagram->id . '.' . 'png';
                $pngData->fileSize = $pngFileSize;
                $pngData->lastUpdate = $nowIsNow;
                $delegate->diagramdataCreate($pngData);
            }
            else{ //Update
                $pngData->fileSize = $pngFileSize;
                $pngData->lastUpdate = $nowIsNow;
                $delegate->diagramdataUpdate($pngData);
            }
        }

        if($display){
            //load png binary data
            $handle = fopen($pngPath, "rb");
    //        print "$pngPath:" . filesize($pngPath);
            $contents = fread($handle, filesize($pngPath));
            fclose($handle);
            //end load png binray data

            //print data
            header("content-type: image/png");
            print($contents);
        } else{
            header("content-type: text/plain");
            print 'You are not allowed to see this information';
        }

        //load data
        break;
        
    case 'jpg':
        //load JPG data
        $jpgData = $delegate->diagramdataGetByDiagramIdAndType($diagram->id, Diagramdata::TYPE_JPG);

        $convertion = false; //flag to request a new convertion
        if (!is_object($jpgData)) { //no JPG file present (at least in DB)
            $convertion = true;
        } else { //JPG exists but is old
            if ($jpgData->lastUpdate < $diagram->lastUpdate) {
                $convertion = true;
            }
        }


        $svgPath = getStorageFolder() . '/' . $diagram->id . '.svg';
        $jpgPath = getStorageFolder() . '/' . $diagram->id . '.jpg';
        if ($convertion) {
            //convert SVG to JPG
            $batikPath = dirname(__FILE__) . '/exporter';
            
            //Note: Always use "%s" to be able to use white spaces in paths
            $command = sprintf('java -jar "%s"/batik-rasterizer.jar -m image/jpeg -q .99 "%s" -d "%s"', $batikPath, $svgPath, $jpgPath);
            $output = shell_exec($command);
            //end conversion


            $jpgFileSize = filesize($jpgPath);

            //see if we need to create the JPG data (first time)
            if (!is_object($jpgData)) { //create
                $jpgData = new Diagramdata();
                $jpgData->diagramId = $diagram->id;
                $jpgData->type = Diagramdata::TYPE_JPG;
                $jpgData->fileName = $diagram->id . '.' . 'jpg';
                $jpgData->fileSize = $jpgFileSize;
                $jpgData->lastUpdate = $nowIsNow;
                $delegate->diagramdataCreate($jpgData);
            }
            else{ //Update
                $jpgData->fileSize = $jpgFileSize;
                $jpgData->lastUpdate = $nowIsNow;
                $delegate->diagramdataUpdate($jpgData);
            }
        }


        if($display){
            //load jpg binary data
            $handle = fopen($jpgPath, "rb");
            $contents = fread($handle, filesize($jpgPath));
            fclose($handle);
            //end load jpg binray data

            //print data
            header("content-type: image/jpeg");
            print($contents);
        } else{
            header("content-type: text/plain");
            print 'You are not allowed to see this information';
        }
        

        //load data
        break;

    case 'svg':
                
        if($display){
            $svgData = $delegate->diagramdataGetByDiagramIdAndType($diagram->id, Diagramdata::TYPE_SVG);

//            $fh = fopen(getStorageFolder() . '/' . $diagram->id . '.svg', 'r');
//            $data = fread($fh, $svgData->fileSize);
//            fclose($fh);
            $data = file_get_contents(getStorageFolder() . '/' . $diagram->id . '.svg');
            
            
            header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
            header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
            header('Content-type: image/svg+xml');
            print $data;
        }
        else{
            header("content-type: text/plain");
            print 'You are not allowed to see this information';
        }
        break;
}
?>
