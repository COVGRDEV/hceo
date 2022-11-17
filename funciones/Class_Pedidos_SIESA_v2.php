<?php
/**
 * Description of Class_Pedidos_SIESA_v2
 *
 * @author Omar Ibanez
 */


require_once "../db/SQLserver/DbClientesSQL.php";
require_once "../db/SQLserver/DbPedidosSQL.php";
require_once "../funciones/Class_Configuracion_SIESA_SQL.php";

require_once("../funciones/Class_Conector_Siesa.php");
require_once("../funciones/Class_Consultas_Siesa.php");
require_once("../funciones/FuncionesPersona.php");
require_once("../db/DbPacientes.php");
require_once("../db/DbListas.php");
require_once("../db/DbMaestroProcedimientos.php");
require_once("../db/DbMaestroInsumos.php");
require_once("../db/DbTiposPago.php");
require_once("../db/DbConvenios.php");
require_once("../db/DbPlanes.php");
require_once("../db/DbPagos.php");
require_once("../db/DbAdmision.php");
require_once("../db/DbDatosEntidad.php");
require_once("../db/DbComunicacionSiesa.php");


class Class_Pedidos_SIESA_v2
{

    public function crearPedido($compania, $co_ventas, $bodega_ventas, $num_doc_usuario, $id_pago, $id_convenio, 
        $id_plan, $id_paciente, $condicion_pago, $lista_productos, $id_usuario) {


            $dbClientesSQL = new DbClientesSQL();
            $dbPedidosSQL = new DbPedidosSQL();
            $class_Configuracion_SIESA_SQL = new Class_Configuracion_SIESA_SQL();

            $classConectorSiesa = new Class_Conector_Siesa();
			$classConsultasSiesa = new Class_Consultas_Siesa();
			$funcionesPersona = new FuncionesPersona();
			$dbPacientes = new DbPacientes();
			$dbListas = new DbListas();
			$dbMaestroProcedimientos = new DbMaestroProcedimientos();
			$dbMaestroInsumos = new DbMaestroInsumos();
			$dbTiposPago = new DbTiposPago();
			$dbConvenios = new DbConvenios();
			$dbPlanes = new DbPlanes();
			$dbDatosEntidad = new DbDatosEntidad();
			$dbComunicacionSiesa = new DbComunicacionSiesa();

            
			$resultado = -1;
			/*Este id se usa como identificador interno en SIESA debido que, al hacer la integración de las dos historias clínicas, 
			 como aún se manejan 2 bases de datos diferentes, el id del pago puede cruzarse, 
			 con la base de datos de HCUT y habrán conflictos al momento de consultar el pago en SIESA. */
			$id_pago_siesa = $id_pago."-1";

            //Se halla el NIT de la entidad
			$entidad_obj = $dbDatosEntidad->getDatosEntidadId($compania);
			$nit_entidad = $entidad_obj["numero_documento"];
			$pos_aux = strpos($nit_entidad, "-");
			if ($pos_aux != false) {
				$nit_entidad = substr($nit_entidad, 0, $pos_aux);
			}
			
			//Se halla el NIT del tercero entidad
			$convenio_obj = $dbConvenios->getConvenio($id_convenio);
			$plan_obj = $dbPlanes->getPlan($id_plan);
			$nit_tercero = $convenio_obj["numero_documento"];
			
			//Se obtienen los datos del paciente
			$paciente_obj = $dbPacientes->getExistepaciente3($id_paciente);
			$num_doc_paciente = $paciente_obj["numero_documento"];
			$nombre_completo = $funcionesPersona->obtenerNombreCompleto($paciente_obj["nombre_1"], $paciente_obj["nombre_2"], $paciente_obj["apellido_1"], $paciente_obj["apellido_2"]);
		
			//Se obtiene la fecha actual
			$fecha_actual = $classConectorSiesa->getFechaActual();


            /*$pedidosArray  = array(
                "compania" => $compania,
                "co_ventas" => $co_ventas,
                "fecha" => $fecha_actual,
                "fecha_entrega" => $fecha_actual,
                "tercero" => $nit_tercero,
                "TERCERO_FACTURAR" => $nit_tercero,
                "CEDULA_VENDEDOR" => $nit_entidad,
                "CONVENIO" => $id_convenio,
                "PLAN" => $id_plan,
                "CONDICION_DE_PAGO" => $condicion_pago,
                "OBSERVACIONES" => $id_pago_siesa
            );*/

            //Se crean los arrays de movimientos y descuentos
			$arr_movimientos = array('data' => array());
			$arr_descuentos = array('data' => array());
			$cont_aux = 1;
			
			foreach ($lista_productos as $prod_aux) {
				if ($prod_aux["valor"] > 0) {
					switch ($prod_aux["tipo_precio"]) {
						case "P":
							$prod_obj = $dbMaestroProcedimientos->getProcedimiento($prod_aux["cod_servicio"]);
							$cod_und_negocios = $prod_obj["cod_und_negocios"];
							break;
						case "I":
							$prod_obj = $dbMaestroInsumos->getInsumo($prod_aux["cod_servicio"]);
							$cod_und_negocios = $prod_obj["cod_und_negocios"];
							break;
						default:
							$cod_und_negocios = "";
							break;
					}
					$arr_aux = array(
                        "NUM_REGISTRO" => $cont_aux,
						"COMPANIA" => $compania,
						"CO_MOVIMIENTO" => $bodega_ventas,
						"BODEGA" => $bodega_ventas,
						"LISTA_DE_PRECIO" => ($prod_aux["tipo_bilateral"] == "0" ? "3" : $prod_aux["tipo_bilateral"]),
						"UNIDAD_MEDIDA" => "UND",
						"CANTIDAD" => $prod_aux["cantidad"],
						"PRECIO_UNITARIO" => $prod_aux["valor"],
						"REFERENCIA" => $prod_aux["cod_servicio"],
						"UNIDAD_NEGOCIO_MOVTO" => $cod_und_negocios,
						"NOMBRE_PACIENTE" => $nombre_completo,
						"CEDULA_PACIENTE" => $num_doc_paciente,
						"FECHA_ENTREGA_PEDIDO" => $fecha_actual,
						"CEDULA_VENDEDOR" => $num_doc_usuario
					);
					
					$bol_agregar_mov = true;
					if ($prod_aux["valor_cuota"] > 0 && $plan_obj["ind_desc_cc"] == "1") {
						$valor_aux = $prod_aux["valor"] * $prod_aux["cantidad"];
						if ($valor_aux > $prod_aux["valor_cuota"]) {
							$arr_aux2 = array(
                                "NUM_REGISTRO" => $cont_aux,
								"COMPANIA" => $compania,
								"COPAGO" => $prod_aux["valor_cuota"]
							);
							array_push($arr_descuentos['data'], $arr_aux2);
						} else {
							$bol_agregar_mov = false;
						}
					}
					
					if ($bol_agregar_mov) {
						array_push($arr_movimientos['data'], $arr_aux);
						
						$cont_aux++;
					}
				}
			}
			$movimientosJSON = json_encode($arr_movimientos,JSON_UNESCAPED_UNICODE);
			$descuentosJSON = json_encode($arr_descuentos,JSON_UNESCAPED_UNICODE);
			//echo($movimientosJSON);
            //Se crean los datos del pedido.
            $resultadoInsertarPedido = $dbPedidosSQL->insertarPedidoPDO($id_pago, $id_pago_siesa, "PEDIDOS", $compania, $co_ventas,$fecha_actual,
            $nit_tercero, $nit_entidad, $id_convenio,$id_plan, $condicion_pago, $movimientosJSON, $descuentosJSON);

            return $resultado;
    }

}
 