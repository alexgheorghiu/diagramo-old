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

class Diagramdata {
	const TYPE_DIA = 'dia';
	const TYPE_SVG = 'svg';
	const TYPE_JPG = 'jpg';
	const TYPE_PNG = 'png';

	public $diagramId;
	public $type;
	public $fileName;
	public $fileSize;
	public $lastUpdate;

	function loadFromSQL($row) {
		$this->diagramId = is_null($row['diagramId']) ? null : $row['diagramId'];
		$this->type = is_null($row['type']) ? null : $row['type'];
		$this->fileName = is_null($row['fileName']) ? null : $row['fileName'];
		$this->fileSize = is_null($row['fileSize']) ? null : $row['fileSize'];
		$this->lastUpdate = is_null($row['lastUpdate']) ? null : $row['lastUpdate'];
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
?>