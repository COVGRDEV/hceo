<?php
require_once("DBTop.php");
class MySQLTop extends DBTop {
	function getThreads(){
		$db = mysql_connect($this->dbHost, $this->dbUser, $this->dbPass);
		// create ProcessList object and set threads
		require_once("ProcessList.php");
		$processList = new ProcessList();
		$result = mysql_query("show processlist", $db);
		while($row = mysql_fetch_assoc($result)) {
			$processList->threads[] = $row;
		}
		return $processList;
	}
	
	function killThread($threadID){
		$db = mysql_connect($this->dbHost, $this->dbUser, $this->dbPass);
		$result = mysql_query("kill " . $threadID, $db);
		if($result == FALSE) {
			return mysql_errno($db);
		} else {
			return "OK";
		}
	}
	
	function explainThread($threadID){
		$db = mysql_connect($this->dbHost, $this->dbUser, $this->dbPass);
		// create explanation object and set threadID to argument
		require_once("Explanation.php");
		$explanation = new Explanation();
		$explanation->threadId = $threadID;
		$sql = ""; 
		$database = "";
		// run a FULL processlist to get full sql for thread
		$processResult = mysql_query("show full processlist", $db);
		// loop thru result until correct thread is found
		while ($processRow = mysql_fetch_array($processResult)){
			if ($processRow['Id'] == $threadID){
				// when correct thread is found, assign sql and database from thread record
				$sql = $processRow['Info'];
				$database = $processRow['db'];
				// break so we don't go over ALL records
				break;
			}
		}
		// assign explanation object's sql property 
		$explanation->sql = $sql;
		// ensure it is a "select" statement
		if (stristr($sql, "select") !== FALSE){
			// must select db to run EXPLAIN (note: ajaxmytop must have permissions to db?)
			mysql_select_db($database, $db) or die ("MySQL ERROR: " . mysql_error());
			$explainSQL = "EXPLAIN " . $sql;
			//echo "explainSQL: " . $explainSQL . "<br/>";
			// run EXPLAIN statement
			$explainResult = mysql_query($explainSQL, $db) or die("MySQL ERROR:" . mysql_error());
			while ($row = mysql_fetch_array($explainResult)){
				// add each explain record (1 for each table) to explanation object's tables array
				$explanation->tables[] = $row;
			}
		} else {
			// if not a select statement, set explanation error as such
			$explanation->error = "You can only explain SELECT queries.";
		}
		return $explanation;
	}
}
?>