<?php
require_once("ConfiguracionSQLServer.php");


class DbUnoeePlanos extends ConfiguracionSQLServer
{

    public function obtenerDatosPlano($idPago, $nombreConector){

        $sql = "SELECT * FROM dbo.t900_UNOEEPlanos 
        WHERE dbo.t900_UNOEEPlanos.f900_IdPago = '$idPago'
        AND dbo.t900_UNOEEPlanos.f900_NomPlano = '$nombreConector'
        ORDER BY dbo.t900_UNOEEPlanos.f900_Orden";

        return $this->ReadData($sql);

    }


}