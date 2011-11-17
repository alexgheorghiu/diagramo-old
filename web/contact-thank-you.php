<?php
$title = "Thank you! | Diagramo";
$description = $title;

$key = explode(" ", $description);
$keywords = trim($key[0]);
for ($i = 1; $i < count($key); $i++) {
    $keywords .= "," . trim($key[$i]);
}


	$nl = "\n\n"; 
	if($_POST[email]!="" && $_POST[myinfo]=="")
	{
		$message .= "Email: $_POST[email]".$nl;		
		$message .= "Enquiry: $_POST[enquiry]".$nl;				

		$message .= "IP: ".$_SERVER['REMOTE_ADDR'].$nl;	
		$message .= "Host: ".gethostbyaddr($_SERVER['REMOTE_ADDR']).$nl;

		//echo $message;
		
		@mail("gheorghiu_alex@yahoo.com", "[Diagramo] Contact enquiry", $message, 
		    "From: $_POST[email]\r\n" 
		   ."Reply-To: $_POST[email]\r\n" 
		   ."X-Mailer: PHP/" . phpversion()); 
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

        <h1>Thank you!</h1>

        <div class="content">

            We have received your enquiry and we'll get back to you as soon as possible.

        </div>

<? include "footer.php"; ?>

    </body>
</html>