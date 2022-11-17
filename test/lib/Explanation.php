<?php
class Explanation{
	// using public properties for simplicity
	public $threadId = "";
	public $sql = "";
	public $tables = array();
	public $error = "";
	
	// function to dump properties in JSON format as a JS variable called 'explain'
	function getJSON(){
		$json = "var explain = { threadId: \"" . $this->threadId . "\", ";
		$json .= "sql: \"" . $this->sql . "\", ";
		$json .= "tables: [ ";
		if (count($this->tables) > 0){
			foreach ($this->tables as $table){
				$json .= "{ ";
				foreach(array_keys($table) as $tableField){
					$json .= " $tableField : \"" . $table[$tableField] . "\", ";
				}
				// after final field, chop off the ', ' and add '}, ' to prepare for next row
				$json = substr($json, 0, strlen($json)-2) . "}, ";
			}
			// after the final row, chop off the ', ' and add ']' to finish array
			$json = substr($json, 0, strlen($json)-2);
		}
		$json .= "]";
		if ($this->error) $json .= ", error: \"" . $this->error . "\"";
		$json .= "};";
		echo $json;
	}
}
?>