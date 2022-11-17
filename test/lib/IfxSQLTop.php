<?php
require_once("DBTop.php");
class IfxSQLTop extends DBTop {
	function getThreads(){
		$sesInfo = $this->getSesInfo();
		$sqlInfo = $this->getSqlInfo();

		foreach ($sesInfo as $sesFields){
			$row = array("Id"=>"", "User"=>"", "Host"=>"", "db"=>"", "Command"=>"","Time"=>"","State"=>"", "Info"=>"");
			if ((sizeof($sesFields) == 10) && ($sesFields[0] != "id")){
				$row["Id"] = $sesFields[0];
				$row["User"] = $sesFields[1];
				$row["Host"] = $sesFields[4];
				// search each sqlFields element in the sqlInfo array 
				// for this sess id
				foreach($sqlInfo as $sqlFields){
					if(array_search($sesFields[0], $sqlFields)==0){
						$row["Command"] = $sqlFields[1];
						$row["db"] = $sqlFields[2];
					}
				}
			}
			$this->threadList[] = $row;
		}
		return $this->threadList;
	}

	function killThread($threadID){
		return "Fake IfxSQL Return";
	}

	function getSesInfo(){
		// get ses info using onstat
		$sesCommand = "/var/informix10/bin/onstat -g ses";
		$sesCommandReturn = shell_exec($sesCommand);
		// split up the return by line breaks
		$sesLines = explode("\n", $sesCommandReturn);
		// slice out the header lines
		$sesLines = array_slice($sesLines, 5);
		// slice out the tailer lines
		$sesLines = array_slice($sesLines, 0, sizeof($sesLines)-2);
		// loop over each session line
		foreach ($sesLines as $sesLine){
			// split the line up into an array by spaces
			$sesFields = preg_split("/[\s,]+/", $sesLine);
			// add that array to the running list of ses info
			$sesInfo[] = $sesFields;
		}
		// return the full list of ses info
		return $sesInfo;
	}
	
	function getSqlInfo(){
		// get sql info using onstat
		$sqlCommand = "/var/informix10/bin/onstat -g sql ";
		$sqlCommandReturn = shell_exec($sqlCommand);
		// Split up the return by line breaks
		$sqlLines = explode("\n", $sqlCommandReturn);
		// Slice out the header lines
		$sqlLines = array_slice($sqlLines, 5);
		// Slice out the tailer lines
		$sqlLines = array_slice($sqlLines, 0, sizeof($sqlLines)-2);
		foreach($sqlLines as $sqlLine){
			// On the first fields, split only on >=2 spaces, some field values have a space
			// Only apply to first 6 fields, to catch the status field as one element
			$firstSqlFields = preg_split("/[\s,]{2,}/", $sqlLine, 6);
			// Get the rest of the remaining fields from the 5th element, separating by space
			$tailSqlFields = preg_split("/[\s,]+/", $firstSqlFields[5]);
			// Remove that 5th element to prepare for merging
			array_pop($firstSqlFields);
			// Merge the arrays to make 1 return array
			$sqlFields = array_merge($firstSqlFields, $tailSqlFields);
			// Check the first element for a space and split it up if it's there
			// (Catching cases where sess id is long enough to make it 1 space away from sql stmt column)
			if (strrpos($sqlFields[0], " ")){
				array_splice($sqlFields, 0, 1, explode(" ", $sqlFields[0]));
			}
			// add this sql info to the running list of sql info
			$sqlInfo[] = $sqlFields;
		}
		// return the full list of sql info
		return $sqlInfo;
	}
}
?>