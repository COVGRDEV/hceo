<?php

class DBTopFactory{
	private $mode = "mysql";
	
	function __construct($mode){
		$this->mode = $mode;
	}
	
	function getDBTop($dbHost, $dbUser, $dbPass){
		switch ($this->mode){
			case("mysql"):
				require_once("MySQLTop.php");
				return new MySQLTop($dbHost, $dbUser, $dbPass);
			case("pgsql"):
				require_once("PgSQLTop.php");
				return new PgSQLTop($dbHost, $dbUser, $dbPass);
			case("ifx"):
				require_once("IfxSQLTop.php");
				return new IfxSQLTop($dbHost, $dbUser, $dbPass);
			default:
				require_once("MySQLTop.php");
				return new MySQLTop($dbHost, $dbUser, $dbPass);
		}
	}
}

?>