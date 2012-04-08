<?php
$currentFolder = dirname(__FILE__);


class Diagram {

	public $id;
	public $hash;
	public $title;
	public $description;
	public $public;
	public $createdDate;
	public $lastUpdate;
	public $size;

	function loadFromSQL($row) {
		$this->id = is_null($row['id']) ? null : $row['id'];
		$this->hash = is_null($row['hash']) ? null : $row['hash'];
		$this->title = is_null($row['title']) ? null : $row['title'];
		$this->description = is_null($row['description']) ? null : $row['description'];
		$this->public = is_null($row['public']) ? null : $row['public'];
		$this->createdDate = is_null($row['createdDate']) ? null : $row['createdDate'];
		$this->lastUpdate = is_null($row['lastUpdate']) ? null : $row['lastUpdate'];
		$this->size = is_null($row['size']) ? null : $row['size'];
	}
}



class Setting {

	public $name;
	public $value;

	function loadFromSQL($row) {
		$this->name = is_null($row['name']) ? null : $row['name'];
		$this->value = is_null($row['value']) ? null : $row['value'];
	}
}

class User {

	public $email;
	public $password;
	public $name;

	function loadFromArray($row) {
		$this->email = $row['email'];
		$this->password = $row['password'];
		$this->name = $row['name'];
	}
}
?>