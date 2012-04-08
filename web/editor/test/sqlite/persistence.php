<?php
class Diagram {

	public $id;
	public $title;
	public $description;
	public $public;
	public $createdDate;
	public $lastUpdate;

	function loadFromSQL($row) {
		$this->id = is_null($row['id']) ? null : $row['id'];
		$this->title = is_null($row['title']) ? null : $row['title'];
		$this->description = is_null($row['description']) ? null : $row['description'];
		$this->public = is_null($row['public']) ? null : $row['public'];
		$this->createdDate = is_null($row['createdDate']) ? null : $row['createdDate'];
		$this->lastUpdate = is_null($row['lastUpdate']) ? null : $row['lastUpdate'];
	}
}


class User {
	public $id;
	public $email;
	public $password;
	public $name;
	public $createdDate;
	public $lastLoginDate;
	public $lastLoginIP;
	public $lastBrowserType;
	public $admin;

	function loadFromSQL($row) {
		$this->id = is_null($row['id']) ? null : $row['id'];
		$this->email = is_null($row['email']) ? null : $row['email'];
		$this->password = is_null($row['password']) ? null : $row['password'];
		$this->name = is_null($row['name']) ? null : $row['name'];
		$this->createdDate = is_null($row['createdDate']) ? null : $row['createdDate'];
		$this->lastLoginDate = is_null($row['lastLoginDate']) ? null : $row['lastLoginDate'];
		$this->lastLoginIP = is_null($row['lastLoginIP']) ? null : $row['lastLoginIP'];
		$this->lastBrowserType = is_null($row['lastBrowserType']) ? null : $row['lastBrowserType'];
		$this->admin = is_null($row['admin']) ? null : $row['admin'];
	}
}

function diagramCreate($dbhandle, $title, $description, $public){
    $stm1 = sprintf("INSERT INTO diagram (title, description, public, createdDate, lastUpdate) 
        VALUES('%s', '%s', '%s', '%s', '%s')", 
            $title, $description, $public, gmdate('Y-m-d H:i:s'), gmdate('Y-m-d H:i:s'));
    #print($stm1);
    $ok1 = sqlite_exec($dbhandle, $stm1);
    if (!$ok1) die("Cannot execute statement.");    
}

function diagramGetById($dbhandle, $diagramId) {
    $d = false;
    $query = sprintf("SELECT * FROM diagram where id=%d", $diagramId);
    $result = sqlite_query($dbhandle, $query);
    if ($result) {
        $row = sqlite_fetch_array($result, SQLITE_ASSOC);
        if($row){
            $d = new Diagram();
            $d->loadFromSQL($row);
        }
    }
        
    return $d;
}


function diagramGetAll($dbhandle) {
    $diagrams = array();
    $query = "SELECT * FROM diagram ORDER BY title";
    $result = sqlite_query($dbhandle, $query);
    if ($result) {
        while($row = sqlite_fetch_array($result, SQLITE_ASSOC)){
            #print_r($row);
            $d = new Diagram();
            $d->loadFromSQL($row);
            $diagrams[] = $d;
        }
    }
        
    return $diagrams;
}

function diagramDeleteById($dbhandle, $diagramId){
    $query = sprintf("delete FROM diagram where id=%d", $diagramId);
    $result = sqlite_query($dbhandle, $query);
    if ($result) {
        
    }
}

$dbhandle = sqlite_open('test.db', 0666, $error);
sqlite_close($dbhandle);
?>
