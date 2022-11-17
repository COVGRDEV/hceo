<?php
require_once("ConfiguracionSQLServer.php");


class DbFacturasSQL extends ConfiguracionSQLServer
{

    public function insertarFacturaPDO($id_pago, $nombre_conector, $compania, $co_ventas, $documento_factura, 
    $consecutivo_factura, $fecha_actual, $nit_tercero, $sucursal_factura, $tipo_cliente,
    $nit_vendedor, $id_convenio, $id_plan, $condicion_pago, $id_pago_siesa, $movimientosJSON, $descuentosJSON){

            
        $myparams['PAGO'] = $id_pago;
        $myparams['NOMBREPLANO'] = $nombre_conector;
        $myparams['CIA'] = $compania;
        $myparams['COVENTAS'] = $co_ventas;
        $myparams['TIPODOCUMENTO'] = $documento_factura; //FEC
        $myparams['CONSECUTIVO'] = $consecutivo_factura; //1
        $myparams['FECHA'] = $fecha_actual;
        $myparams['TERCERO'] = $nit_tercero;
        $myparams['SUCURSAL'] = $sucursal_factura; //"001"
        $myparams['TIPOCLIENTE'] = $tipo_cliente; //"0001"
        $myparams['TERCEROREMISION'] = $nit_tercero; 
        $myparams['SUCURSALREMISION'] = $sucursal_factura; //"001"
        $myparams['TERCEROVENDEDOR'] = $nit_vendedor; 
        $myparams['PLAN'] = $id_plan; 
        $myparams['CONVENIO'] = $id_convenio; 
        $myparams['CONDICIONPAGO'] = $condicion_pago; 
        $myparams['NOTASFACTURA'] = $id_pago_siesa; 
        $myparams['movimientosJSON'] = $movimientosJSON;
        $myparams['descuentosJSON'] = $descuentosJSON;
        

        var_dump($myparams);
        
        /*$sql = "EXEC dbo.SP_Unoee_Plano_Obligaciones @PAGO = ?, @NomPlano = ?, @CIA = ?, 
                @TERCERO = ?, @GrupoEntidad = ?, 
                @IdEntidad_1 = ?, @IdAtributo_1 = ?,@IdMaestro_1 = ?, @IdMaestroDetalle_1 = ?,  
                @IdEntidad_2 = ?, @IdAtributo_2 = ?,@IdMaestro_2 = ?, @IdMaestroDetalle_2 = ?,  
                @IdEntidad_3 = ?, @IdAtributo_3 = ?,@IdMaestro_3 = ?, @IdMaestroDetalle_3 = ?,  
                @DatoTexto = ?, @DatoFecha = ?, @TipoEntidad = ?";
        
        return $this->RunStoredProcedure($sql, $procedure_params);   */   


    }


}