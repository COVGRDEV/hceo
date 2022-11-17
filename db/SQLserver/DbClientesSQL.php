<?php
require_once("ConfiguracionSQLServer.php");


class DbClientesSQL extends ConfiguracionSQLServer
{

    public function obtenerClienteDetalle($documentoCliente, $cia){

        $sql = "SELECT * FROM dbo.vw_Unoee_Clientes 
        WHERE dbo.vw_Unoee_Clientes.Tercero = '$documentoCliente'
        AND dbo.vw_Unoee_Clientes.Cia = $cia";

        return $this->ReadOneData($sql);

    }


    public function obtenerObligacionesTercero($documentoCliente, $cia){
        $sql = "SELECT * FROM dbo.vw_Unoee_EntidadesTerceros
                WHERE dbo.vw_Unoee_EntidadesTerceros.f200_nit = '$documentoCliente'
                AND dbo.vw_Unoee_EntidadesTerceros.f200_id_cia = $cia";

        return $this->ReadOneData($sql);
    
    }
    

    public function insertarVigaraPDO($id_pago,$nombre_conector, $compania,$num_doc_tercero, $tipo_documento,
    $apellido_1, $apellido_2,$nombres,$direccion,$pais,$departamento, $ciudad,$telefono_1, $email_aux, 
    $fecha_actual, $ciuu){
        
       
        $myparams['PAGO'] = $id_pago;
        $myparams['NomPlano'] = $nombre_conector;
        $myparams['CIA'] = $compania;
        $myparams['TERCERO'] = $num_doc_tercero;
        $myparams['TipoId'] = $tipo_documento;
        $myparams['Apellido1'] = $apellido_1;
        $myparams['Apellido2'] = $apellido_2;
        $myparams['Nombres'] = $nombres;
        $myparams['Direccion'] = $direccion;
        $myparams['Pais'] = $pais;
        $myparams['Dpto'] = $departamento;
        $myparams['Ciudad'] = $ciudad;
        $myparams['Telefono'] = $telefono_1;
        $myparams['Correo'] =$email_aux;
        $myparams['fecha'] = $fecha_actual;
        $myparams['Ciuu'] = $ciuu;
       
        // Set up the proc params array - be sure to pass the param by reference
        $procedure_params = array(
        array(&$myparams['PAGO'], SQLSRV_PARAM_IN),
        array(&$myparams['NomPlano'], SQLSRV_PARAM_IN),
        array(&$myparams['CIA'], SQLSRV_PARAM_IN),
        array(&$myparams['TERCERO'], SQLSRV_PARAM_IN),
        array(&$myparams['TipoId'], SQLSRV_PARAM_IN),
        array(&$myparams['Apellido1'], SQLSRV_PARAM_IN),
        array(&$myparams['Apellido2'], SQLSRV_PARAM_IN),
        array(&$myparams['Nombres'], SQLSRV_PARAM_IN),
        array(&$myparams['Direccion'], SQLSRV_PARAM_IN),
        array(&$myparams['Pais'], SQLSRV_PARAM_IN),
        array(&$myparams['Dpto'], SQLSRV_PARAM_IN),
        array(&$myparams['Ciudad'], SQLSRV_PARAM_IN),
        array(&$myparams['Telefono'], SQLSRV_PARAM_IN),
        array(&$myparams['Correo'], SQLSRV_PARAM_IN),
        array(&$myparams['fecha'], SQLSRV_PARAM_IN),
        array(&$myparams['Ciuu'], SQLSRV_PARAM_IN),
        );

        $sql = "EXEC dbo.SP_Unoee_Plano_Terceros @PAGO = ?, @NomPlano = ?, @CIA = ?, 
                @TERCERO = ?, @TipoId = ?, @Apellido1 = ?, @Apellido2 = ?, @Nombres = ?, @Direccion = ?,
                @Pais = ?, @Dpto = ?, @Ciudad = ?, @Telefono = ?, @Correo = ?, @fecha = ?, @Ciuu = ?";
        
        return $this->RunStoredProcedure($sql, $procedure_params);        
       
    }

    public function insertarClientePDO($id_pago,$nombre_conector, $compania,$num_doc_tercero, $tipo_documento,
    $sucursal, $condicion_pago,$apellido_1, $apellido_2,$nombres,$direccion,$pais,$departamento, $ciudad, 
    $telefono_1, $email_aux, $fecha_actual){
        
        $myparams['PAGO'] = $id_pago;
        $myparams['NomPlano'] = $nombre_conector;
        $myparams['CIA'] = $compania;
        $myparams['TERCERO'] = $num_doc_tercero;
        $myparams['SUCURSAL'] = $sucursal;
        $myparams['CONDICIONPAGO'] = $condicion_pago;        
        $myparams['Apellido1'] = $apellido_1;
        $myparams['Apellido2'] = $apellido_2;
        $myparams['Nombres'] = $nombres;
        $myparams['Direccion'] = $direccion;
        $myparams['Pais'] = $pais;
        $myparams['Dpto'] = $departamento;
        $myparams['Ciudad'] = $ciudad;
        $myparams['Telefono'] = $telefono_1;
        $myparams['Correo'] =$email_aux;
        $myparams['fecha'] = $fecha_actual;
             
        // Set up the proc params array - be sure to pass the param by reference
        $procedure_params = array(
            array(&$myparams['PAGO'], SQLSRV_PARAM_IN),
            array(&$myparams['NomPlano'], SQLSRV_PARAM_IN),
            array(&$myparams['CIA'], SQLSRV_PARAM_IN),
            array(&$myparams['TERCERO'], SQLSRV_PARAM_IN),
            array(&$myparams['SUCURSAL'], SQLSRV_PARAM_IN),
            array(&$myparams['CONDICIONPAGO'], SQLSRV_PARAM_IN),
            array(&$myparams['Apellido1'], SQLSRV_PARAM_IN),
            array(&$myparams['Apellido2'], SQLSRV_PARAM_IN),
            array(&$myparams['Nombres'], SQLSRV_PARAM_IN),
            array(&$myparams['Direccion'], SQLSRV_PARAM_IN),
            array(&$myparams['Pais'], SQLSRV_PARAM_IN),
            array(&$myparams['Dpto'], SQLSRV_PARAM_IN),
            array(&$myparams['Ciudad'], SQLSRV_PARAM_IN),
            array(&$myparams['Telefono'], SQLSRV_PARAM_IN),
            array(&$myparams['Correo'], SQLSRV_PARAM_IN),
            array(&$myparams['fecha'], SQLSRV_PARAM_IN)
        );

        $sql = "EXEC dbo.SP_Unoee_Plano_Clientes @PAGO = ?, @NomPlano = ?, @CIA = ?, 
                @TERCERO = ?, @SUCURSAL = ?, @CONDICIONPAGO = ?, @Apellido1 = ?, @Apellido2 = ?, @Nombres = ?, @Direccion = ?,
                @Pais = ?, @Dpto = ?, @Ciudad = ?, @Telefono = ?, @Correo = ?, @fecha = ?";
        
        return $this->RunStoredProcedure($sql, $procedure_params);        
       
    }

    public function insertarEntidadCorreoPDO($id_pago,$nombre_conector, $compania,$num_doc_tercero, 
    $sucursal, $grupo_entidad, $id_entidad, $id_atributo, $dato_texto, $dato_fecha, $id_maestro,
    $id_maestro_detalle, $id_maestro_interno_detalle, $tipo_entidad){

        $myparams['PAGO'] = $id_pago;
        $myparams['NomPlano'] = $nombre_conector;
        $myparams['CIA'] = $compania;
        $myparams['TERCERO'] = $num_doc_tercero;
        $myparams['SUCURSAL'] = $sucursal;
        $myparams['GrupoEntidad'] = $grupo_entidad;        
        $myparams['IdEntidad'] = $id_entidad;
        $myparams['IdAtributo'] = $id_atributo;
        $myparams['DatoTexto'] = $dato_texto;
        $myparams['DatoFecha'] = $dato_fecha;
        $myparams['IdMaestro'] = $id_maestro;
        $myparams['IdMaestroDetalle'] = $id_maestro_detalle;
        $myparams['IdMaestroInternoDetalle'] = $id_maestro_interno_detalle;
        $myparams['TipoEntidad'] = $tipo_entidad;
    
             
        // Set up the proc params array - be sure to pass the param by reference
        $procedure_params = array(
            array(&$myparams['PAGO'], SQLSRV_PARAM_IN),
            array(&$myparams['NomPlano'], SQLSRV_PARAM_IN),
            array(&$myparams['CIA'], SQLSRV_PARAM_IN),
            array(&$myparams['TERCERO'], SQLSRV_PARAM_IN),
            array(&$myparams['SUCURSAL'], SQLSRV_PARAM_IN),
            array(&$myparams['GrupoEntidad'], SQLSRV_PARAM_IN),
            array(&$myparams['IdEntidad'], SQLSRV_PARAM_IN),
            array(&$myparams['IdAtributo'], SQLSRV_PARAM_IN),
            array(&$myparams['DatoTexto'], SQLSRV_PARAM_IN),
            array(&$myparams['DatoFecha'], SQLSRV_PARAM_IN),
            array(&$myparams['IdMaestro'], SQLSRV_PARAM_IN),
            array(&$myparams['IdMaestroDetalle'], SQLSRV_PARAM_IN),
            array(&$myparams['IdMaestroInternoDetalle'], SQLSRV_PARAM_IN),
            array(&$myparams['TipoEntidad'], SQLSRV_PARAM_IN),
       
        );


        $sql = "EXEC dbo.SP_Unoee_Plano_Correo_fe @PAGO = ?, @NomPlano = ?, @CIA = ?, 
                @TERCERO = ?, @SUCURSAL = ?, @GrupoEntidad = ?, @IdEntidad = ?, @IdAtributo = ?, @DatoTexto = ?, @DatoFecha = ?,
                @IdMaestro = ?, @IdMaestroDetalle = ?,@IdMaestroInternoDetalle=?, @TipoEntidad = ?";
        
        return $this->RunStoredProcedure($sql, $procedure_params);        
       
    }

    public function insertarEntidadObligacionesPDO($id_pago,$nombre_conector, $compania, $num_doc_tercero, 
    /*$grupo_entidad, $id_entidad, $id_atributo, $dato_texto, $dato_fecha, $id_maestro,
    $id_maestro_detalle, $tipo_entidad*/$grupo_entidad,$obligacionesJSON, $dato_texto, $dato_fecha, $tipo_entidad){


        $myparams['PAGO'] = $id_pago;
        $myparams['NomPlano'] = $nombre_conector;
        $myparams['CIA'] = $compania;
        $myparams['TERCERO'] = $num_doc_tercero;
        $myparams['json'] = $obligacionesJSON;
        /*$i=1;
        foreach ($obligacionesArray as $key => $value) {
            $myparams['IdEntidad_'.$i] = $value["nom_entidad"];
            $myparams['IdAtributo_'.$i] = $value["atributo"];
            $myparams['IdMaestro_'.$i] = $value["cod_maestro"];
            $myparams['IdMaestroDetalle_'.$i] = $value["detalle_maestro"];
            $i++;
        }*/

        $myparams['GrupoEntidad'] = $grupo_entidad;        
        $myparams['DatoTexto'] = $dato_texto;
        $myparams['DatoFecha'] = $dato_fecha;
        $myparams['TipoEntidad'] = $tipo_entidad;
    
             
        // Set up the proc params array - be sure to pass the param by reference
        $procedure_params = array(
            array(&$myparams['PAGO'], SQLSRV_PARAM_IN),
            array(&$myparams['NomPlano'], SQLSRV_PARAM_IN),
            array(&$myparams['CIA'], SQLSRV_PARAM_IN),
            array(&$myparams['TERCERO'], SQLSRV_PARAM_IN),
            array(&$myparams['GrupoEntidad'], SQLSRV_PARAM_IN),
            array(&$myparams['json'], SQLSRV_PARAM_IN),
            /*array(&$myparams['IdEntidad_1'], SQLSRV_PARAM_IN),
            array(&$myparams['IdAtributo_1'], SQLSRV_PARAM_IN),
            array(&$myparams['IdMaestro_1'], SQLSRV_PARAM_IN),
            array(&$myparams['IdMaestroDetalle_1'], SQLSRV_PARAM_IN),
            array(&$myparams['IdEntidad_2'], SQLSRV_PARAM_IN),
            array(&$myparams['IdAtributo_2'], SQLSRV_PARAM_IN),
            array(&$myparams['IdMaestro_2'], SQLSRV_PARAM_IN),
            array(&$myparams['IdMaestroDetalle_2'], SQLSRV_PARAM_IN),
            array(&$myparams['IdEntidad_3'], SQLSRV_PARAM_IN),
            array(&$myparams['IdAtributo_3'], SQLSRV_PARAM_IN),
            array(&$myparams['IdMaestro_3'], SQLSRV_PARAM_IN),
            array(&$myparams['IdMaestroDetalle_3'], SQLSRV_PARAM_IN),*/

            array(&$myparams['DatoTexto'], SQLSRV_PARAM_IN),
            array(&$myparams['DatoFecha'], SQLSRV_PARAM_IN),
            array(&$myparams['TipoEntidad'], SQLSRV_PARAM_IN)
        );

        $sql = "EXEC dbo.SP_Unoee_Plano_Obligaciones @PAGO = ?, @NomPlano = ?, @CIA = ?, 
                @TERCERO = ?, @GrupoEntidad = ?, @json = ?,
                @DatoTexto = ?, @DatoFecha = ?, @TipoEntidad = ?";


        /*$sql = "EXEC dbo.SP_Unoee_Plano_Obligaciones @PAGO = ?, @NomPlano = ?, @CIA = ?, 
                @TERCERO = ?, @GrupoEntidad = ?, 
                @IdEntidad_1 = ?, @IdAtributo_1 = ?,@IdMaestro_1 = ?, @IdMaestroDetalle_1 = ?,  
                @IdEntidad_2 = ?, @IdAtributo_2 = ?,@IdMaestro_2 = ?, @IdMaestroDetalle_2 = ?,  
                @IdEntidad_3 = ?, @IdAtributo_3 = ?,@IdMaestro_3 = ?, @IdMaestroDetalle_3 = ?,  
                @DatoTexto = ?, @DatoFecha = ?, @TipoEntidad = ?";*/
        
        return $this->RunStoredProcedure($sql, $procedure_params);      


    }


}