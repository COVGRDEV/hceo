<?php
// written by brett pierce 
// brett@brettvile.com 
// subsequently butchered by Luke Crouch

require_once("config.php");
require_once("lib/DBTopFactory.php");
   
// go to DB (via factory) to get array of threads
$dbTopFactory = new DBTopFactory($dbServer);
$dbTop = $dbTopFactory->getDBTop($dbHost, $dbUser, $dbPass);
$processList = $dbTop->getThreads();
$threadArray = $processList->threads;

// *** new filter section
$filteredArray = array();
for ($i=0; $i<count($threadArray); $i++){
	//format Host.
	$threadArray[$i]['Host'] = chopHost($threadArray[$i]['Host']);
	$insertFlag = 1;
	foreach($filters as $currentFilter) {
		$filterVal = ($_GET[$currentFilter]) ? ($_GET[$currentFilter]) : "ALL";
		if($insertFlag != 0) {
			$insertFlag = filter($threadArray[$i][$currentFilter],$filterVal,$currentFilter);
		}
	}
	if ($insertFlag == 1) {
		$filteredArray[] = $threadArray[$i];
	}
}

// *** sorting section (should wrap into function)
$sortByCol = $_GET['sortByCol'];
$sortByOrder = $_GET['sortByOrder'];
$sortArr = array();
foreach($filteredArray as $key=>$row){
	$sortArr[$key] = $row[$sortByCol];
}
if ($sortByOrder == "ASC"){
	array_multisort($sortArr, SORT_ASC, $filteredArray);   	
} else if ($sortByOrder == "DESC"){
	array_multisort($sortArr, SORT_DESC, $filteredArray);
}
   
// *** xml output section (should wrap into function as well)
// setup the initial root element of the xml document.
$xml = new DomDocument();   
$rootElement = $xml->createElement('response');
$rootElement = $xml->appendChild($rootElement);

foreach($filteredArray as $row) {
	       
		//create a new thread element.
		$thread = $xml->createElement('div');
		$thread->setAttribute('class','Columns dataRow');
		$thread->setAttribute('id', 'threadRow' . $row['Id']);
		$thread->setAttribute('title', 'Click to explain SELECT.');
		$thread->setAttribute('onmouseover','highlight(this);');
		$thread->setAttribute('onmouseout','deHighlight(this);');
		$thread->setAttribute('onclick', 'new Explanation(' . $row['Id'] .');');
		
		//insert thread into DOM object.
		$thread = $rootElement->appendChild($thread);
		
		// add each column into thread
		foreach($row as $fieldname => $fieldvalue) {						
			$child = $xml->createElement('div');
			$child->setAttribute('class','Column dataDetail');
			$child = $thread->appendChild($child);
			    
			$value = $xml->createTextNode($fieldvalue);
			$value = $child->appendChild($value);
		}	     
}
   
   $xml_string = $xml->saveXML();
   
   header("Content-Type: text/xml"); 
   echo $xml_string;
 
   
   // ** helper functions filter and chopHost
   function filter($fieldValue,$filterValue,$currentFilter) {
   	
      if($currentFilter == "Command" && $filterValue == "awake") {
         if($fieldValue != "Sleep") {
            return 1;
         }
      }
   	  
      if($filterValue == "ALL") {
         return 1; 
      }
      
      if($fieldValue == $filterValue) {
         return 1;
      }
      
      return 0;
   }

   
   function chopHost($host) {
      //this function will return the appropriate hostname
      //or IP address without the port specifications.
      	
      //strip the port.
      $chopped_fieldvalue = explode(":",$host);
      $chopped_fieldvalueNoPort = $chopped_fieldvalue[0];
   	  $chopped_array = explode(".",$chopped_fieldvalueNoPort);
   	  
   	  //now determine what to return.
   	  if(count($chopped_array) == 4) {
   	    //this is an IP address.
   	    return($chopped_fieldvalueNoPort);
   	  } else {
   	  	//return the host name without domain(s).
   	  	return($chopped_array[0]); //return first element in explode list.
   	  }//end if/else.
   	  
   }//end chopHost.
   
?>
