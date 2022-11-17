<?php
/**
 * Description of Class_Clientes_SIESA
 *
 * @author Omar Ibanez
 */

require_once "../funciones/Class_Conector_Siesa.php";
require_once "../db/SQLserver/DbClientesSQL.php";
require_once "../db/DbPacientes.php";
require_once "../db/DbAdmision.php";
require_once "../db/DbListas.php";
require_once "../db/DbTerceros.php";
require_once "../db/DbComunicacionSiesa.php";
require_once "../funciones/Class_Configuracion_SIESA_SQL.php";

class Class_Clientes_SIESA
{

    public function crearTerceroClientePaciente($id_tercero_pago, $compania, $num_doc_tercero, $id_paciente,
        $id_lugar_cita, $id_admision, $id_usuario, $id_pago) {

        $dbAdmision = new DbAdmision();
        $dbListas = new DbListas();
        $dbTerceros = new DbTerceros();
        $dbComunicacionSiesa = new DbComunicacionSiesa();
        $dbPacientes = new DbPacientes();
        $dbClientesSQL = new DbClientesSQL();
        $classConectorSiesa = new Class_Conector_Siesa();
        $class_Configuracion_SIESA_SQL = new Class_Configuracion_SIESA_SQL();


        $paciente = $dbPacientes->getExistepaciente3($id_paciente); //Consulta el paciente en local
        $sede = $dbListas->getSedesDetalle($id_lugar_cita);
        $email_aux = filter_var(trim($paciente["email"]), FILTER_VALIDATE_EMAIL) ? trim($paciente["email"]) : $sede["email_sede_det"];
        $numero_documento = $paciente["numero_documento"];
        $nombres = trim($paciente["nombre_1"] . " " . $paciente["nombre_2"]);
        $apellido_1 = $paciente["apellido_1"];
        $apellido_2 = $paciente["apellido_2"];
        $nombre_completo = substr($nombres . " " . $apellido_1 . " " . $apellido_2, 0, 50);
        $direccion = substr($paciente["direccion"], 0, 40);
        $pais = ($paciente["paisCodSiesa"] <= 0 ? "169" : $paciente["paisCodSiesa"]); //Sí el país es diferente a Colombia quema el valor a Colombia (169)
        $departamento = ($paciente["paisCodSiesa"] <= 0 ? "68" : $paciente["cod_dep"]); //Sí el país es diferente a Colombia quema el valor a Santander(68),
        $ciudad = ($paciente["paisCodSiesa"] <= 0 ? "001" : (substr($paciente["cod_mun"], 2))); //Sí el país es diferente a Colombia quema el valor a Bucaramanga(001),
        $ciudadSiesa = ($pais . $departamento . $ciudad);
        $telefono_1 = substr($paciente["telefono_1"], 0, 20);
        $fecha_nacimiento = (date("Ymd", strtotime($paciente["fecha_nacimiento"])));
        $fecha_actual = $classConectorSiesa->getFechaActual();
        $tipo_doc = $paciente["codigo_doc_siesa"];

        $clienteSQLObj = $dbClientesSQL->obtenerClienteDetalle($num_doc_tercero, $compania); //Se consulta el cliente en siesa.
        $resultado = 1;

        if(is_null($clienteSQLObj)){
            //Se insertan los datos del tercero vigara en la tabla [dbo].[t900_UNOEEPlanos]
            $resultadoInsertarTerceroVigara = $dbClientesSQL->insertarVigaraPDO($id_pago, "TERCEROS_VIGARA", $compania, $numero_documento,
                $tipo_doc, $apellido_1, $apellido_2, $nombres, $direccion, $pais, $departamento, $ciudad, $telefono_1, $email_aux,
                $fecha_nacimiento, "");

            //SE CREA EL TERCERO VIGARA
            $resultado = $class_Configuracion_SIESA_SQL->ejecutarEnvioDatos($id_pago, "TERCEROS_VIGARA", $compania, 13, 3, 0);

            if ($resultado <> 1) {
                
                $resultado = json_encode($resultado); //$rtaTerceroVigaraCreado["ImportarDatosXMLResult"];
                $dbComunicacionSiesa->insertar_comunicacion_siesa(13, $id_paciente, "", $id_pago, "", $resultado, $id_usuario);
                $resultado = -1;

            } 

            if ($resultado>0) {

                //SE CREA EL TERCERO CLIENTE.
                $resultadoInsertarTerceroCliente = $dbClientesSQL->insertarClientePDO($id_pago, "TERCEROS_CLIENTES", $compania, $numero_documento,
                    $tipo_doc, "001", "CON", $apellido_1, $apellido_2, $nombres, $direccion, $pais, $departamento, $ciudad, $telefono_1, $email_aux,
                    $fecha_actual);

                $resultado = $class_Configuracion_SIESA_SQL->ejecutarEnvioDatos($id_pago, "TERCEROS_CLIENTES", $compania, 14, 3, 0);

                if ($resultado <> 1) {

                    $resultado = json_encode($resultado); //$rtaTerceroVigaraCreado["ImportarDatosXMLResult"];
                    $dbComunicacionSiesa->insertar_comunicacion_siesa(14, $id_paciente, "", $id_pago, "", $resultado, $id_usuario);
                    $resultado = -1;

                }

            }
        }

        $obligacionesTercero = $dbClientesSQL->obtenerObligacionesTercero($num_doc_tercero, $compania);   //Se consultan las obligaciones del tercero
      
        if ($resultado > 0 && is_null($obligacionesTercero)) {
            //SE CREA ENTIDAD OBLIGACIONES.
            $obligacionesArray = array(
                'data'=> array(
                    array(
                        'orden'=>1,
                        'nom_entidad' => 'EUNOECO017',
                        'atributo' => 'co017_codigo_regimen',
                        'cod_maestro' => 'MUNOECO016',
                        'detalle_maestro' => 49,
                    ),
                    array(
                        'orden'=>2,
                        'nom_entidad' => 'EUNOECO017',
                        'atributo' => 'co017_cod_tipo_oblig',
                        'cod_maestro' => 'MUNOECO019',
                        'detalle_maestro' => 'R-99-PN',
                    ),
                    array(
                        'orden'=>3,
                        'nom_entidad' => 'EUNOECO031',
                        'atributo' => 'co031_detalle_tributario1',
                        'cod_maestro' => 'MUNOECO035',
                        'detalle_maestro' => '01',
                    ),
                )
            );

            $obligacionesJSON = json_encode($obligacionesArray,JSON_UNESCAPED_UNICODE);
            $resultadoInsertarObligacionesCliente = $dbClientesSQL->insertarEntidadObligacionesPDO($id_pago, "ENTIDAD_FE_TERCEROS", $compania,
                $num_doc_tercero, "FE_COD/TIPO OBLIGACION 2.1", $obligacionesJSON, "", "", "M200");

            $resultado = $class_Configuracion_SIESA_SQL->ejecutarEnvioDatos($id_pago, "ENTIDAD_FE_TERCEROS", $compania, 14, 3, 0);
           
            if ($resultado <> 1) {

                $resultado = json_encode($resultado); //$rtaTerceroVigaraCreado["ImportarDatosXMLResult"];
                $dbComunicacionSiesa->insertar_comunicacion_siesa(21, $id_paciente, "", $id_pago, "", $resultado, $id_usuario);
                $resultado = -1;
            } 
        }

        //SE CREA LA ENTIDAD CORREO.
        if ($resultado > 0 && (is_null($clienteSQLObj) || $clienteSQLObj['Email_FactElect'] != $email_aux)) {

            $id_entidad = $sede["id_entidadCorreo_sede_det"];
            $id_atributo = $sede["id_atributoCorreo_sede_det"];
            $id_maestro_interno_detalle = $ciudadSiesa;
            $resultadoInsertarCorreoCliente = $dbClientesSQL->insertarEntidadCorreoPDO($id_pago, "ENTIDAD_FE_CORREO_CLIENTE", $compania, $numero_documento,
                "001", "FE CORREO CLIENTE", $id_entidad, $id_atributo, $email_aux, "", "", "", $id_maestro_interno_detalle, "M201");

            $resultado = $class_Configuracion_SIESA_SQL->ejecutarEnvioDatos($id_pago, "ENTIDAD_FE_CORREO_CLIENTE", $compania, 14, 3, 0);

            if ($resultado <> 1) {

                $resultado = json_encode($resultado['NewDataSet']); //$rtaTerceroVigaraCreado["ImportarDatosXMLResult"];
                $dbComunicacionSiesa->insertar_comunicacion_siesa(11, $id_paciente, "", $id_pago, "", $resultado, $id_usuario);
                $resultado = -1;

            }
        }


        return $resultado;

    }

    public function crearTerceroClienteNoPaciente($id_tercero_pago, $compania, $num_doc_tercero, $id_paciente,
        $id_lugar_cita, $id_admision, $id_usuario, $id_pago) {
        
        $dbPacientes = new DbPacientes();
        $dbAdmision = new DbAdmision();
        $dbListas = new DbListas();
        $dbTerceros = new DbTerceros();
        $dbComunicacionSiesa = new DbComunicacionSiesa();
        $dbClientesSQL = new DbClientesSQL();
        $classConectorSiesa = new Class_Conector_Siesa();
        $class_Configuracion_SIESA_SQL = new Class_Configuracion_SIESA_SQL();

      
        $paciente = $dbPacientes->getExistepaciente3($id_paciente); //Consulta el paciente en local
        $tercero = $dbTerceros->getTercero($id_tercero_pago);
        $sede = $dbListas->getSedesDetalle($_SESSION["idLugarUsuario"]); //Obtiene el detalle de la sede con la cual inició sesión
        $email_aux = (filter_var($tercero["email"], FILTER_VALIDATE_EMAIL) ? $tercero["email"] : (filter_var($paciente["email"], FILTER_VALIDATE_EMAIL) ? $paciente["email"] : $sede["email_sede_det"]));
        $numero_documento = $tercero["numero_documento"];
        
        $banderaDetTributario = true;
        if ($tercero["id_tipo_documento"] == "146") {
            $cod_obligacion = $tercero["cod_obligacion"];
            $cod_tributario = $tercero["cod_tributario"];
            if (is_null($cod_obligacion) || empty($cod_obligacion) || is_null($cod_tributario) || empty($cod_tributario)) {
                $banderaDetTributario = false;
            }
            if ($tercero["ind_iva"] == "1") {
                $regimen = 48;
            } else {
                $regimen = 49;
            }
        } else {
            $cod_obligacion = "R-99-PN";
            $cod_tributario = "01";
            $regimen = 49;
        }

        if ($tercero["nombre_1"] != "") {
            $nombres = trim($tercero["nombre_1"] . " " . $tercero["nombre_2"]);
            $apellido_1 = $tercero["apellido_1"];
            $apellido_2 = $tercero["apellido_2"];
            $nombre_completo = trim(substr($nombres . " " . $apellido_1 . " " . $apellido_2, 0, 50));
        } else {
            $nombres = $tercero["nombre_tercero"];
            $apellido_1 = "";
            $apellido_2 = "";
            $nombre_completo = $tercero["nombre_tercero"];
        }

        $direccion = substr($paciente["direccion"], 0, 40);
        $pais = ($paciente["paisCodSiesa"] <= 0 ? "169" : $paciente["paisCodSiesa"]); //Sí el país es diferente a Colombia quema el valor a Colombia (169)
        $departamento = ($paciente["paisCodSiesa"] <= 0 ? "68" : $paciente["cod_dep"]); //Sí el país es diferente a Colombia quema el valor a Santander(68),
        $ciudad = ($paciente["paisCodSiesa"] <= 0 ? "001" : (substr($paciente["cod_mun"], 2))); //Sí el país es diferente a Colombia quema el valor a Bucaramanga(001),
        $ciudadSiesa = ($pais . $departamento . $ciudad);
        $telefono_1 = substr($paciente["telefono_1"], 0, 20);
        $fecha_nacimiento = "20000101";
        $fecha_actual = $classConectorSiesa->getFechaActual();
        $tipo_doc = $tercero["codigo_doc_siesa"];

        $clienteSQLObj = $dbClientesSQL->obtenerClienteDetalle($num_doc_tercero, $compania);
        $resultado = 1;

        if (is_null($clienteSQLObj)) {
            //Se insertan los datos del tercero vigara en la tabla [dbo].[t900_UNOEEPlanos]
            $resultadoInsertarTerceroVigara = $dbClientesSQL->insertarVigaraPDO($id_pago, "TERCEROS_VIGARA", $compania, $numero_documento,
                $tipo_doc, $apellido_1, $apellido_2, $nombres, $direccion, $pais, $departamento, $ciudad, $telefono_1, $email_aux,
                $fecha_nacimiento, "");

            if ($resultadoInsertarTerceroVigara) { //Se creo el registro de datos en la tabla [dbo].[t900_UNOEEPlanos] en SQLSERVER

                $resultado = $class_Configuracion_SIESA_SQL->ejecutarEnvioDatos($id_pago, "TERCEROS_VIGARA", $compania, 13, 3, 0);

                if ($resultado <> 1) {

                    $resultado = json_encode($resultado); //$rtaTerceroVigaraCreado["ImportarDatosXMLResult"];
                    $dbComunicacionSiesa->insertar_comunicacion_siesa(13, $id_paciente, "", $id_pago, "", $resultado, $id_usuario);
                    $resultado = -1;

                } 

            }

            //SE CREA EL TERCERO CLIENTE.
            $resultadoInsertarTerceroCliente = $dbClientesSQL->insertarClientePDO($id_pago, "TERCEROS_CLIENTES", $compania, $numero_documento,
                $tipo_doc, "001", "CON", $apellido_1, $apellido_2, $nombres, $direccion, $pais, $departamento, $ciudad, $telefono_1, $email_aux,
                $fecha_actual);

            $resultado = $class_Configuracion_SIESA_SQL->ejecutarEnvioDatos($id_pago, "TERCEROS_CLIENTES", $compania, 14, 3, 0);

            if ($resultado <> 1) {

                $resultado = json_encode($resultado); //$rtaTerceroVigaraCreado["ImportarDatosXMLResult"];
                $dbComunicacionSiesa->insertar_comunicacion_siesa(14, $id_paciente, "", $id_pago, "", $resultado, $id_usuario);
                $resultado = -1;

            }
        }
       
        $obligacionesTercero = $dbClientesSQL->obtenerObligacionesTercero($num_doc_tercero, $compania);   //Se consultan las obligaciones del tercero
       
        if ($resultado > 0 && is_null($obligacionesTercero)) {
            //SE CREA ENTIDAD OBLIGACIONES.
            $obligacionesArray = array(
                1 => array(
                    'nom_entidad' => 'EUNOECO017',
                    'atributo' => 'co017_codigo_regimen',
                    'cod_maestro' => 'MUNOECO016',
                    'detalle_maestro' => $regimen,
                ),
                2 => array(
                    'nom_entidad' => 'EUNOECO017',
                    'atributo' => 'co017_cod_tipo_oblig',
                    'cod_maestro' => 'MUNOECO019',
                    'detalle_maestro' => $cod_obligacion,
                ),
                3 => array(
                    'nom_entidad' => 'EUNOECO031',
                    'atributo' => 'co031_detalle_tributario1',
                    'cod_maestro' => 'MUNOECO035',
                    'detalle_maestro' => $cod_tributario,
                ),
            );

            $resultadoInsertarObligacionesCliente = $dbClientesSQL->insertarEntidadObligacionesPDO($id_pago, "ENTIDAD_FE_TERCEROS", $compania,
                $num_doc_tercero, "FE_COD/TIPO OBLIGACION 2.1", $obligacionesArray, "", "", "M200");

            $resultado = $class_Configuracion_SIESA_SQL->ejecutarEnvioDatos($id_pago, "ENTIDAD_FE_TERCEROS", $compania, 14, 3, 0);
           
            if ($resultado <> 1) {

                $resultado = json_encode($resultado); //$rtaTerceroVigaraCreado["ImportarDatosXMLResult"];
                $dbComunicacionSiesa->insertar_comunicacion_siesa(21, $id_paciente, "", $id_pago, "", $resultado, $id_usuario);
                $resultado = -1;

            }
        }


        //SE ENVIA LA ENTIDAD DEL CORREO
        if ($resultado > 0 && (is_null($clienteSQLObj) || $clienteSQLObj['Email_FactElect'] != $email_aux)) {

            $id_entidad = $sede["id_entidadCorreo_sede_det"];
            $id_atributo = $sede["id_atributoCorreo_sede_det"];

            $resultadoInsertarCorreoCliente = $dbClientesSQL->insertarEntidadCorreoPDO($id_pago, "ENTIDAD_FE_CORREO_CLIENTE", $compania, $numero_documento,
                "001", "FE CORREO CLIENTE", $id_entidad, $id_atributo, $email_aux, "", "", "", "M201");

            $resultado = $class_Configuracion_SIESA_SQL->ejecutarEnvioDatos($id_pago, "ENTIDAD_FE_CORREO_CLIENTE", $compania, 11, 3, 0);

            if ($resultado <> 1) {

                $resultado = json_encode($resultado); //$rtaTerceroVigaraCreado["ImportarDatosXMLResult"];
                $dbComunicacionSiesa->insertar_comunicacion_siesa(11, $id_paciente, "", $id_pago, "", $resultado, $id_usuario);
                $resultado = -1;

            }
        }

        return $resultado;

    }

}
