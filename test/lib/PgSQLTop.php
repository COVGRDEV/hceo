<?php
require_once("DBTop.php");
class PgSQLTop extends DBTop {
	function getThreads(){
		for($i=0; $i<6; $i++){
			$row = array("Id"=>"PgId".$i, "User"=>"PgUser".$i, "Host"=>"PgHost".$i, "db"=>"Pgdb".$i, "Command"=>"PgCommand".$i,"Time"=>"PgTime".$i,"State"=>"PgState".$i, "Info"=>"PgInfo".$i);
			$this->threadList[] = $row;
		}
		return $this->threadList;
	}
	function killThread($threadID){
		return "Fake PgSQL Return";
	}
}
?>