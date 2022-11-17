<?php
class ProcessList{
	// using public properties for simplicity
	public $threads = array();
	
	// function to dump properties in JSON format as a JS variable called 'explain'
	function getJSON(){
		$json = "var processList = { ";
		$json .= "threads: [ ";
		if (count($this->threads) > 0){
			foreach ($this->threads as $thread){
				$json .= "{ ";
				foreach(array_keys($thread) as $threadField){
					$json .= " $threadField : \"" . $thread[$threadField] . "\", ";
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
