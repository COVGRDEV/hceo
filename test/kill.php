<?php
   require_once("config.php");
   require_once("lib/DBTopFactory.php");
   
	mysql_connect($dbHost, $dbUser, $dbPass);

   $xml = new DomDocument();
   
   //setup the initial root element of the xml document.
   $rootElement = $xml->createElement('response');
   $rootElement = $xml->appendChild($rootElement);
   
      
   $child = $xml->createElement('kill');
   $child->setAttribute('class','ddColumn');
   $child = $rootElement->appendChild($child);

   //kill the thread passed in on the $_GET['Id']
   
   $dbTopFactory = new DBTopFactory($dbServer);
   $dbTop = $dbTopFactory->getDBTop($dbHost, $dbUser, $dbPass);
   $killReturn = $dbTop->killThread($_GET['Id']);
   
   $value = $xml->createTextNode($killReturn);
   $value = $child->appendChild($value);
   
   $xml_string = $xml->saveXML();
   header("Content-Type: text/xml"); 
   echo $xml_string;
   
?>