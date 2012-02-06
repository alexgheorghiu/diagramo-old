<?php

/**
 * Gets data from a specific URL
 * It will try several methods before fails.
 *
 * @param $url - the URL to get data from
 * @return data if accessible or false if not accessible
 */
function get($url) {

    // Try to get the url content with file_get_contents()
    $getWithFileContents = getWithFileContents($url);
    if ($getWithFileContents !== false) {
        return trim($getWithFileContents);
    }

    // Try to get the url content with cURL library
    $getWithCURL = getWithCURL($url);
    if ($getWithCURL !== false) {
        return trim($getWithCURL);
    }

    // Default, return false
    return false;
}

/**
 * Use file_get_contents to access data from URL
 * @return data if accessible or false if not accessible
 */
function getWithFileContents($fileLocation) {
    return file_get_contents($fileLocation);
}

/**
 * Use cURL to access data from URL
 * @return data if accessible or false if not accessible
 */
function getWithCURL($fileLocation) {
    if (function_exists('curl_init') AND function_exists("curl_exec")) {
        $ch = curl_init($fileLocation);

        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $data = curl_exec($ch);
        curl_close($ch);

        return $data ? $data : false;
    } else {
        return false;
    }
}

function timezones() {
    $timezones = array(
        0 => array('dif' => '-12', 'name' => 'Enewetak, Kwajalein'),
        1 => array('dif' => '-11', 'name' => 'Midway Island, Samoa'),
        2 => array('dif' => '-10', 'name' => 'Hawaii'),
        3 => array('dif' => '-9.5', 'name' => 'French Polynesia'),
        4 => array('dif' => '-9', 'name' => 'Alaska'),
        5 => array('dif' => '-8', 'name' => 'Pacific Time (US &amp; Canada)'),
        6 => array('dif' => '-7', 'name' => 'Mountain Time (US &amp; Canada)'),
        7 => array('dif' => '-6', 'name' => 'Central Time (US &amp; Canada), Mexico City'),
        8 => array('dif' => '-5', 'name' => 'Eastern Time (US &amp; Canada), Bogota, Lima'),
        9 => array('dif' => '-4', 'name' => 'Atlantic Time (Canada), Caracas, La Paz'),
        10 => array('dif' => '-3.5', 'name' => 'Newfoundland'),
        11 => array('dif' => '-3', 'name' => 'Brazil, Buenos Aires, Falkland Island'),
        12 => array('dif' => '-2', 'name' => 'Mid-Atlantic, Ascention Is., St Helena'),
        13 => array('dif' => '-1', 'name' => 'Azores, Cape Verde Islands'),
        14 => array('dif' => '0', 'name' => 'Casablanca, Dublin, London, Lisbon, Monrovia'),
        15 => array('dif' => '+1', 'name' => 'Brussels, Copenhagen, Madrid, Paris'),
        16 => array('dif' => '+2', 'name' => 'Bucharest, Kaliningrad, South Africa'),
        17 => array('dif' => '+3', 'name' => 'Baghdad, Riyadh, Moscow, Nairobi'),
        18 => array('dif' => '+3.5', 'name' => 'Tehran'),
        19 => array('dif' => '+4', 'name' => 'Abu Dhabi, Baku, Muscat, Tbilisi'),
        20 => array('dif' => '+4.5', 'name' => 'Kabul'),
        21 => array('dif' => '+5', 'name' => 'Ekaterinburg, Karachi, Tashkent'),
        22 => array('dif' => '+5.5', 'name' => 'Bombay, Calcutta, Madras, New Delhi'),
        23 => array('dif' => '+6', 'name' => 'Almaty, Colombo, Dhaka'),
        24 => array('dif' => '+6.5', 'name' => 'Yangon, Naypyidaw, Bantam'),
        25 => array('dif' => '+7', 'name' => 'Bangkok, Hanoi, Jakarta'),
        26 => array('dif' => '+8', 'name' => 'Beijing, Hong Kong, Perth, Singapore, Taipei'),
        27 => array('dif' => '+9', 'name' => 'Osaka, Sapporo, Seoul, Tokyo, Yakutsk'),
        28 => array('dif' => '+9.5', 'name' => 'Adelaide, Darwin'),
        29 => array('dif' => '+10', 'name' => 'Melbourne, Papua New Guinea, Sydney'),
        30 => array('dif' => '+10.5', 'name' => 'Lord Howe Island'),
        31 => array('dif' => '+11', 'name' => 'Magadan, New Caledonia, Solomon Island'),
        32 => array('dif' => '+11.5', 'name' => 'Burnt Pine, Kingston'),
        33 => array('dif' => '+12', 'name' => 'Auckland, Fiji, Marshall Island'),
        34 => array('dif' => '+13', 'name' => 'Kamchatka, Anadyr'),
        35 => array('dif' => '+14', 'name' => 'Kiritimati')
    );

    return $timezones;
}

/**
 * Takes a special formatted sql file and split into commands
 * !!! THE COMMANDS ARE SPLIT BY COMMENTS !!!
 * @param $fileName - the file name of the SQL file
 */
function getSQLCommands($fileName) {
    $commands = array();

    $fh = fopen($fileName, 'r');
    if ($fh) {
        $command = '';
        while (($buffer = fgets($fh, 4096)) !== false) {
            if (strpos($buffer, '--') === 0) {  //we have a 'special' comment
                //add current command to commands
                if (count(trim($command)) > 0) {
                    $commands[] = $command;
                }

                //reset current command
                $command = '';
            } else if (count(trim($buffer)) > 0) { //we have a command (fragment), try to ignore blank lines
                $command .= ' ' . $buffer;
            }
        }

        //add last line command to commands
        if (count(trim($command)) > 0) {
            $commands[] = $command;
        }

        if (!feof($fh)) {
            echo "Error: unexpected fgets() fail\n";
        }

        fclose($fh);
    }

    return $commands;
}

/* * Returns day & time */

function now($tzOffset = 0) {
    return date('Y-m-d H:i:s', gmtTime($tzOffset));
}

/**
 * Get a date (GMTTIME) with a timezone offset
 *
 * 	gmtTime() will return the current gmt 0 time
 * 	gmtTime(3) will return the current gmt time +3 hours
 * 	gmtTime(-3) will return the current gmt time -3 hours
 *
 * @param	int $timezone
 * @return	int unix timespan
 *
 * @author	Liviu
 * @since	May, 2009
 */
function gmtTime($timezone = 0) {
    $gmtDatetime = gmdate('Y-m-d H:i:s', time());
    $gmtInteger = strtotime($gmtDatetime);

    /* (!) DO NOT DELETE THAT (!)
      // If daylight saving time
      if(date('I', $gmtInteger) == 1) {
      $daylightSavingTime = 3600;
      } else {
      $daylightSavingTime = 0;
      }

      return $gmtInteger+$daylightSavingTime+60*60*$timezone;
     */

    return $gmtInteger + 60 * 60 * $timezone;
}

/* retuns last inserted Id */

function lastId($con) {
    if (mysql_affected_rows($con)) {
        $query = 'SELECT LAST_INSERT_ID() AS NEW_ID';
        $result = mysql_query($query, $con);
        $row = mysql_fetch_array($result, MYSQL_ASSOC);
        $number = $row['NEW_ID'];
        return $number;
    }
}

function testJava() {
    $r = exec('java Echo');
    if ($r == 'ok') {
        return true;
    }

    return false;
}

/**
 * Find the URL under which the current PHP file is run
 * @see http://dev.kanngard.net/Permalinks/ID_20050507183447.html
 */
function selfURL() {
    $s = empty($_SERVER["HTTPS"]) ? '' : ($_SERVER["HTTPS"] == "on") ? "s" : "";
    
    $protocol = strleft(strtolower($_SERVER["SERVER_PROTOCOL"]), "/") . $s;
    
    $port = ($_SERVER["SERVER_PORT"] == "80") ? "" : (":" . $_SERVER["SERVER_PORT"]);
    
    return $protocol . "://" . $_SERVER['SERVER_NAME'] . $port . $_SERVER['REQUEST_URI'];
}


function strleft($s1, $s2) {
    return substr($s1, 0, strpos($s1, $s2));
}

?>
