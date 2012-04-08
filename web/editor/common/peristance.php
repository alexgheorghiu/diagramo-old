<?php

@session_start();

require_once(dirname(__FILE__) . '/settings.php');
require_once(dirname(__FILE__) . '/entities.php');
require_once(dirname(__FILE__) . '/utils.php');

/**
 * LICENSE
 * License Class is not reflected in the Database (it was not generates by SQLarity)
 * To generate a license you need first 8 fields completed
 */
class License {

	//from client
	public $serial;   // buyer's serial number
	public $host; //Where the license will be installed
	//from server
	public $date;   // purchase date (SQL datetime) as 'yyyy-mm-dd'
	public $unlockKey;  // full key of the license (license object saved to a string)

	/**
	 * Saves the License object (this) object to a string
	 */

	public function save() {
		$this->unlockKey = $this->computeUnlockKey();
		return base64_encode(strrev(serialize($this)));
	}

	/**
	 * Load the License object (this) from a string
	 */
	public function load($str) {
		//load stored object
		$obj = unserialize(strrev(base64_decode($str)));

		//copy data from loaded object into our *this* object - (clone?)
		$this->serial = $obj->serial;	// Random generated
		$this->host = $obj->host;

		$this->date = $obj->date;
		$this->unlockKey = $obj->unlockKey;   // Full license (the same with the DB company.license)
	}

	/*
	 * Computes License's full key based on its other values
	 * The key is based on email, date, expiryDate, maxUsers and serial
	 */

	protected function computeUnlockKey() {
		$computedKey = md5(
				strrev($this->host) .
				strtolower(substr(base64_encode($this->date), 0, 5)) .
				$this->serial);

		/* Return final computed key */
		return $computedKey;
	}

	/** Check a license */
	public function checkLicense() {
		$recomputedFullLicense = $this->computeUnlockKey();
		return ($this->unlockKey == $recomputedFullLicense) ? true : false;
	}

}

function loadCSV($filePath) {
	$rows = array();
	if (($handle = fopen($filePath, "r")) !== FALSE) {
		$columns = fgetcsv($handle, 1000, "\t");
		print_r($columns);
		while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) {
			for ($i = 0; $i < count($columns); $i++) {
				$row[$columns[$i]] = $data[$i];
			}

			$rows[] = $row;
		}
		fclose($handle);
	}

	return $rows;
}

/*
 * Get all users 
 */

function userGetAll() {
	$usersPath = dirname(__FILE__) . '/../data/users.txt';
	if (!file_exists($usersPath)) {
		throw "File : " . $usersPath . ' does not exist';
	}

	$users = array();
	$usersArray = loadCSV($usersPath);
	print_r($usersArray);

	foreach ($usersArray as $user) {
		print_r($user);
		$u = new User();
		$u->loadFromArray($user);
		$users[] = $u;
	}
	return $users;
}



function userAdd($email, $password, $name) {
	
	//check if already present user exists
	$users = userGetAll();
	foreach($users as $user){
		if($user->email == $email){
			return false;
		}
	}
	
	
	//save new user
	$usersPath = dirname(__FILE__) . '/../data/users.txt';
	$fh = fopen($usersPath, 'a');
	$row = sprintf("%s\t%s\t%s\n",  $email, $password, $name);
	fwrite($fh, $row);
	fclose($fh);	
}


function userEdit($email, $password, $name){
	$usersPath = dirname(__FILE__) . '/../data/users.txt';
	
	$usersArray = loadCSV($usersPath);
	
	print "loaded: " .  print_r($usersArray, true);
	
	$newArray = array();
	foreach ($usersArray as $user) {
		if($user['email'] == $email){
			$newArray[] = array('email' => $email, 'password' => $password, 'name' => $name);
		}
		else{
			$newArray[] = $user;
		}
	}

	print "prelucrat: " .  print_r($newArray, true);
	
	
	$fh = fopen($usersPath, 'w');
	$row = sprintf("email\tpassword\tname\n");
	fwrite($fh, $row);
	foreach ($newArray as $user) {
		$row = sprintf("%s\t%s\t%s\n",  $user['email'], $user['password'], $user['name']);
		fwrite($fh, $row);
	}
	fclose($fh);	
}


function userRemove($email){
	$usersPath = dirname(__FILE__) . '/../data/users.txt';
	
	$usersArray = loadCSV($usersPath);
	
	print "loaded: " .  print_r($usersArray, true);
	
	$newArray = array();
	foreach ($usersArray as $user) {
		if($user['email'] == $email){
			continue;
		}
		$newArray[] = $user;
	}

	print "prelucrat: " .  print_r($newArray, true);
	
	
	$fh = fopen($usersPath, 'w');
	$row = sprintf("email\tpassword\tname\n");
	fwrite($fh, $row);
	foreach ($newArray as $user) {
		$row = sprintf("%s\t%s\t%s\n",  $user['email'], $user['password'], $user['name']);
		fwrite($fh, $row);
	}
	fclose($fh);			
}


/* * *************************************************************************** */
/* * *************************CONSOLE TESTINING********************************* */
/* * *************************************************************************** */
if (true && PHP_SAPI == 'cli') { //see http://php.net/manual/en/features.commandline.php
	print("\nOn the console");

	print_r(userGetAll());
	
//	userAdd('nana@brasov.ro', '123456');
//	userAdd('ioana@brasov.ro', '1234446', 'Ioana Popon');
	
	//userRemove('nana@brasov.ro');
	userEdit('alex@scriptoid.com', '12121212', 'Alexandru Florin Gheorghiu');
}
?>