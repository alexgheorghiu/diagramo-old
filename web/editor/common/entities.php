<?php
$currentFolder = dirname(__FILE__);


class Diagram {

	public $id;
	public $title;
	public $description;
	public $public;
	public $createdDate;
	public $lastUpdate;
	public $size;

	function loadFromSQL($row) {
		$this->id = $row['id'];
		$this->title = $row['title'];
		$this->description = $row['description'];
		$this->public = $row['public'];
		$this->createdDate = $row['createdDate'];
		$this->lastUpdate = $row['lastUpdate'];
		$this->size = $row['size'];
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