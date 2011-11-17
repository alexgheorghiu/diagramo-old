<?php
$title = "Contact | Diagramo";
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

        <h1>Contact</h1>

        <div class="content">

            <form action="contact-thank-you.php" method="POST">
                Email:<br />
                <input type="text" name="email" class="myinput" /> <br/><br />
                Enquiry:<br />
                <textarea name="enquiry" class="mytextarea"></textarea><br/><br />

                <input type="submit" value="Send" class="mysubmit" />
				<input name="myinfo" class="myinfo">
            </form>

        </div>

<? include "footer.php"; ?>

    </body>
</html>