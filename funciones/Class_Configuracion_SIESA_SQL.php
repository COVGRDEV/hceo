<?php
/**
 * Description of Class_Configuracion_SIESA_SQL
 *
 * @author Omar Ibanez
 */

require_once("../db/DbServiciosIntegracion.php");
require_once("../funciones/nusoap.php");
require_once("../db/SQLserver/DbUnoeePlanos.php");

class Class_Configuracion_SIESA_SQL
{

	public function ejecutarEnvioDatos($id_pago,$nombreConector,$compania,$cod_servicio,$id_consulta, $test){

		$dbServiciosIntegracion = new DbServiciosIntegracion();
		$dbUnoeePlanos = new DbUnoeePlanos();
		$servicioIntegracion = $dbServiciosIntegracion->getServicioIntegracion($cod_servicio);
		$servicioIntegracionConsulta = $dbServiciosIntegracion->getServicioIntegracionConsulta($id_consulta);
		$resultado = -1;

		
		//Se obtienen los datos a enviar en la tabla de [dbo].[t900_UNOEEPlanos] es decir la Sarta.
		$datos = $dbUnoeePlanos->obtenerDatosPlano($id_pago,$nombreConector);

		//Se Arma el XML de los datos consultados.
		$xmlDatos = $this->armarXMLDatos($datos);

		
		//Se arma el XML de configuración de conexión.
		$xmlEncabezado = $this->armarXMLEncabezado($servicioIntegracionConsulta["nombreConexion_sico"],
		$compania,"unoee","Vgr270747");


		//Se une el XML de datos y encabezado.
		$xmlCompleto = $this->armarXMLEnviar($xmlEncabezado,$xmlDatos);	


		if ($test == 0) {//Con valor 1 es para probar y ver la estructura xml que será enviada

			$url = $servicioIntegracionConsulta['url_wsdl'];

			try {

				$resultado = $this->enviarXMLSiesa($url,$nombreConector, $xmlCompleto);


			} catch (Exception $ex) {

				$resultado = $ex->getMessage();

			}
		} else {
			echo htmlentities($xmlCompleto);
		}
		
		return $resultado;
	}

    public function armarXMLDatos($datos){
		
		$xml="<Datos>";

			foreach ($datos as $key => $value) {

				$xml.= "<Linea>".$value['f900_Sarta']."</Linea>";
				
			}

		$xml.="</Datos>";

		return $xml;

	}

	public function armarXMLEncabezado($nombreConexion_sico, $cia, $usuario, $clave){

	
		$xml="<NombreConexion>".$nombreConexion_sico."</NombreConexion>";
		$xml.="<IdCia>".$cia."</IdCia>";
		$xml.="<Usuario>".$usuario."</Usuario>";
		$xml.="<Clave>".$clave."</Clave>";

		return $xml;

	} 

	public function armarXMLEnviar($xmlEncabezado,$xmlDatosTercero){

		$xml="<Importar>";
		$xml.=$xmlEncabezado;
		$xml.=$xmlDatosTercero;
		$xml.="</Importar>";

		return $xml;
	}

	public function enviarXMLSiesa($url,$nombreConector, $xmlCompleto){
		
		$client = new nusoap_client($url, 'wsdl');
		$client->soap_defencoding = 'UTF-8';
		$client->decode_utf8 = FALSE;

		$arrayParametros = array();
		$arrayParametros['pvstrDatos'] = $xmlCompleto;

		$resultado = $client->call('ImportarXML', $arrayParametros);   
		
		if($resultado["printTipoError"] === "0" ){

			$resultado = 1;

		}elseif (isset($resultado["ImportarXMLResult"]["diffgram"]["NewDataSet"])) {

			$resultado = $resultado["ImportarXMLResult"]["diffgram"]["NewDataSet"];

		}else {
			$resultado = "Error al enviar los datos al web service de SIESA";
		}
	
		return $resultado;
	}

}
