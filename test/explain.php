<?php
//$link = mysql_connect('localhost:/tmp/mysql41.sock', 'ajaxmytop', 'ajaxmytop');
//$database = "test";
//$sql = "SELECT * from t1, t1 t2";
//mysql_select_db($database, $link);
//$explainSQL = "EXPLAIN " . $sql;
//echo $explainSQL;
//$explainResult = mysql_query($explainSQL, $link) or die(mysql_error());
//while($explainRow = mysql_fetch_array($explainResult)){
//$tables[] = $explainRow;
//}
//print_r($tables); 
   require_once("config.php");
   require_once("lib/DBTopFactory.php");
   $threadId = $_GET['Id'];
   
   $dbTopFactory = new DBTopFactory($dbServer);
   $dbTop = $dbTopFactory->getDBTop($dbHost, $dbUser, $dbPass);
   $explanation = $dbTop->explainThread($threadId);
   $explanation->getJSON();   
?>