<?php
abstract class DBTop{
	public $dbHost;
	public $dbUser;
	public $dbPass;
	
	public $threadList = array();
	public $explainList = array();
	
	function __construct($dbHost, $dbUser, $dbPass){
		$this->dbHost = $dbHost;
		$this->dbUser = $dbUser;
		$this->dbPass = $dbPass;
	}
	
	abstract function getThreads();
	
	abstract function killThread($threadID);
	
	abstract function explainThread($threadID);
}
?>