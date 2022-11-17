<?php


class ConfiguracionSQLServer
{

     public function OpenConnection()
     {
          $serverName = "209.172.44.85";
          $username = "sa";
          $password = "+-SQL_Access_code-+";
          $database = "VGR_reportes";

          $connectionOptions = array("Database" => $database,
               "Uid" => $username, "PWD" => $password, 
               "CharacterSet"=>"UTF-8",
               "Encrypt"=>false, "TrustServerCertificate"=>false);

          $conn = sqlsrv_connect($serverName, $connectionOptions);
          if ($conn == false)
               die(var_dump(sqlsrv_errors()));

          return $conn;

     }

     public function ReadData($sql)
     {
          $data = array();
          try {
               $conn = $this->OpenConnection();
               $tsql = $sql;
               $getData = sqlsrv_query($conn, $tsql);
               if ($getData == FALSE)
                    die(var_dump(sqlsrv_errors()));
               $dataCount = 0;
               while ($row = sqlsrv_fetch_array($getData, SQLSRV_FETCH_ASSOC)) {
                    $data[$dataCount] = $row;
                    $dataCount++;
               }

               sqlsrv_free_stmt($getData);
               sqlsrv_close($conn);
               return $data;
          }
          catch (Exception $e) {
               return $e;
          }
     }
     

     public function ReadOneData($sql) {
          $fila = array();
          
          try {
               $conn = $this->OpenConnection();
               $tsql = $sql;
               $getData = sqlsrv_query($conn, $tsql);
               if ($getData == FALSE)
                    die(var_dump(sqlsrv_errors()));
               
               $row_count = sqlsrv_num_rows($getData);   
                
               if (!$row_count){
                    $fila = sqlsrv_fetch_array($getData, SQLSRV_FETCH_ASSOC);
               }
          
               
               $row_count = null;
               sqlsrv_free_stmt($getData);
               sqlsrv_close($conn);
               return $fila;
          } catch (Exception $e) {
               sqlsrv_close($conn);
               return $e;
          }
     }

     
     function RunStoredProcedure($sql,$procedure_params)
     {
         try
         {
          $conn = $this->OpenConnection();
          $tsql = $sql;

          $stmt = sqlsrv_prepare($conn, $sql, $procedure_params);
          if( !$stmt ) {
               die( print_r( sqlsrv_errors(), true));
          }
       
          if(sqlsrv_execute($stmt)){

              return sqlsrv_next_result($stmt);

          }else{
               die( print_r( sqlsrv_errors(), true));
          }
         }
         catch(Exception $e)
         {
             print_r($e, true);
         }

     }

     function InsertData($sql)
     {
         try
         {
             $conn = OpenConnection();
             $tsql = $sql;
             $insertReview = sqlsrv_query($conn, $tsql);
             if($insertReview == FALSE)
                 die(FormatErrors( sqlsrv_errors()));
             echo "Product Key inserted is :";
             while($row = sqlsrv_fetch_array($insertReview, SQLSRV_FETCH_ASSOC))
             {
                 echo($row['ProductID']);
             }
             sqlsrv_free_stmt($insertReview);
             sqlsrv_close($conn);
         }
         catch(Exception $e)
         {
             echo("Error!");
         }
     }


}

?>