<?php
require_once("ConfiguracionSQLServer.php");

class Test extends ConfiguracionSQLServer {

    /*public function getStatusConnection(){
        return $this->OpenConnection();
    }*/

    public function getCountries(){
        $sql = "SELECT * FROM dbo.vw_Unoee_Paises";
        return $this->ReadData($sql);
    }

    public function getCities(){
        $sql = "SELECT * FROM dbo.vw_Unoee_Ciudades";
        return $this->ReadData($sql);
    }

    public function getCustomers(){
        $sql = "SELECT TOP 1500 * FROM dbo.vw_Unoee_Clientes";
        return $this->ReadData($sql);
    }

    public function getStates(){
        $sql = "SELECT TOP 10 * FROM dbo.vw_Unoee_Departamentos";
        return $this->ReadData($sql);
    }

    
}
