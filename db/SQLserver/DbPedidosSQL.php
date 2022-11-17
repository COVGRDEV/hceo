<?php
require_once("ConfiguracionSQLServer.php");


class DbPedidosSQL extends ConfiguracionSQLServer
{

    public function insertarPedidoPDO($id_pago,$id_pago_siesa, $nombre_conector, $compania, $co_ventas,$fecha_actual,
    $nit_tercero, $nit_entidad, $id_convenio, $id_plan, $condicion_pago, $movimientosJSON, $descuentosJSON){

            /*@PAGO AS VARCHAR(150),
            @NOMBREPLANO AS VARCHAR(150),
            @CIA AS VARCHAR(3),
            @COVENTAS AS VARCHAR(3), 
            @TIPODOCUMENTO AS VARCHAR(3),
            @CONSECUTIVO AS VARCHAR(8),
            @FECHA AS VARCHAR(8),
            @TERCERO AS VARCHAR(15),
            @SUCURSAL AS VARCHAR(3),
            @TIPOCLIENTE AS VARCHAR(4),
            @TERCEROREMISION AS VARCHAR(15),
            @SUCURSALREMISION AS VARCHAR(3),
            @TERCEROVENDEDOR AS VARCHAR(15),
            @PLAN AS VARCHAR(10),
            @CONVENIO AS VARCHAR(12),
            @CONDICIONPAGO AS VARCHAR(10),
            @NOTASFACTURA AS VARCHAR(2000),
        
        
        
            @movimientosJSON NVARCHAR(MAX),
            @descuentosJSON as NVARCHAR(MAX)*/	
            
        $myparams['PAGO'] = $id_pago;
        $myparams['NOMBREPLANO'] = $nombre_conector;
        $myparams['CIA'] = $compania;
        $myparams['COVENTAS'] = $co_ventas;
        $myparams['TIPODOCUMENTO'] = $tipo_documento; //FEC
        $myparams['CONSECUTIVO'] = $consecutivo_factura; //1
        $myparams['FECHA'] = $fecha_actual;
        $myparams['TERCERO'] = $nit_tercero;
        $myparams['SUCURSAL'] = $sucursal_factura; //"001"
        $myparams['TIPOCLIENTE'] = $tipo_cliente; //"0001"

        $myparams['movimientosJSON'] = $movimientosJSON;
        $myparams['descuentosJSON'] = $descuentosJSON;
        
        
        /*$sql = "EXEC dbo.SP_Unoee_Plano_Obligaciones @PAGO = ?, @NomPlano = ?, @CIA = ?, 
                @TERCERO = ?, @GrupoEntidad = ?, 
                @IdEntidad_1 = ?, @IdAtributo_1 = ?,@IdMaestro_1 = ?, @IdMaestroDetalle_1 = ?,  
                @IdEntidad_2 = ?, @IdAtributo_2 = ?,@IdMaestro_2 = ?, @IdMaestroDetalle_2 = ?,  
                @IdEntidad_3 = ?, @IdAtributo_3 = ?,@IdMaestro_3 = ?, @IdMaestroDetalle_3 = ?,  
                @DatoTexto = ?, @DatoFecha = ?, @TipoEntidad = ?";
        
        return $this->RunStoredProcedure($sql, $procedure_params);   */   


    }


}