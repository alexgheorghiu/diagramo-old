<?php
$title = "Privacy policy";
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

        <h1>Privacy policy</h1>

        <div class="content" style="line-height:20px;">
            <p><b></b>
            <br/>
            We, Scriptoid, have a moral and a legal obligation to keep the safety and privacy of all the informations that are brought to us by our users.            We take this job seriously and we ensure the safety of your personal data given to us while using our sites and our products, including your name and your e-mail address.            The agreement set out below indicates the privacy policy under which you agree to use this site.            By using this site and/or by sending us your information at an email address on this site you have agreed to this privacy policy.        </p>

        <p><b>Types of information collected</b><br/>
			Several of the services and features that we offer on our sites require you to provide us with information as a condition of using them.			While using our sites and our products, when you ask for information, you participate at our promotions, you make product suggestions, you benefit of certain promotional offers, your might give us certain data about yourself, such as your name, your e-mail address, your postal address and so on.			All the data you give us is voluntary and you are free to decide not to provide that information.			Users agree that we may use that information for invoicing users, providing the site services and customizing the user experience, as well as for preventing unauthorized activities or activities in breach of the site normal use.        </p>

        <p><b>Use of collected data</b><br/>
			We use the data you gave to us only for our company, in order to improve the products we offer to you all, to contact the users about the products and the services on our sites, to send you information you agreed to receive about topics we think will be of interest to you.			We will not sell, share, or rent this information to others in ways different from what is disclosed in this statement.			Yet we might share aggregated, general statistic demographic information with our partners and advertisers for marketing, promotional, business purposes, but this is not linked to any personal information that can identify an individual person.			User information may be disclosed only in accordance with national and international laws, on the judicial institutions' order or in other legal compulsory situations.			We are also entitled to use that information when we believe that your actions violate applicable laws, or threaten the rights, property, or safety of our company, our users, or others.			We are always seeking to improve our network of web sites and our business so we may buy or sell a company or a business, in which case we may transfer some or all of your information as a part of the sale in order that the service being provided to you may continue.        </p>

        <p><b>Information update and unsubscription</b><br/>
            If you want us to update or to delete some or all the data about yourself from our databases and/or receive no further information from us, just send us an e-mail from the contact page on this site expressly mentioning the update or the unsubscription demand and its limits and we will follow your instructions carefully.        </p>

        <p><b>Changes in Privacy Policy</b><br/>

            If we decide to change our privacy policy, we will post those changes on our homepage so that our users are always aware of the way we use the information provided to us.        </p>

        
        </div>

        <? include "footer.php"; ?>

    </body>
</html>