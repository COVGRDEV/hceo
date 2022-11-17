<?php
	/*
	  Pagina para mover masivamente las historias antiguas de la carpeta de scanner al interior de la HC
	  Autor: Feisar Moreno - 11/05/2016
	*/
	require_once("../db/DbImportarHc.php");
	require_once("../db/DbHistoriaClinica.php");
	require_once("../db/Dbvariables.php");
	require_once("../funciones/Utilidades.php");
	
	$dbImportarHc = new DbImportarHc();
	$dbHistoriaClinica = new DbHistoriaClinica();
	$dbVariables = new Dbvariables();
	$utilidades = new Utilidades();
	
	function get_ruta_archivo($id_paciente) {
		//Se obtiene la fecha actual
		$dbVariables = new Dbvariables();
		$arr_fecha_act = $dbVariables->getAnoMesDia();
		
		$ruta = "../imagenes/imagenes_hce/".$arr_fecha_act["anio_actual"]."/".$arr_fecha_act["mes_actual"]."/".
				 $arr_fecha_act["dia_actual"]."/".$id_paciente."/";
		
		return $ruta;
	}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Mover historias antiguas</title>
</head>

<body>
<?php
	//Se obtiene el listado de archivos a mover
	$listaArchivos = $dbImportarHc->getListaHCAntiguasMover();
	
	//Se obtiene la ruta de donde se leerán los archivos
	$variable_obj = $dbVariables->getVariable(11);
	$ruta_base = $variable_obj["valor_variable"];
	echo("Ruta inicial de los archivos: ".$ruta_base."<br /><br />");
	
	$id_usuario = 1;
	
	if (count($listaArchivos) > 0) {
		foreach ($listaArchivos as $archivo_aux) {
			$id_paciente = $archivo_aux["id_paciente"];
			$id_hc = $archivo_aux["id_hc"];
			
			echo("Moviendo archivo ".$archivo_aux["archivo_hc"]."<br />");
			
			//Se busca el nombre que tendrá el archivo
			$extension_aux = $utilidades->get_extension_arch($archivo_aux["archivo_hc"]);
			$ruta_archivo = get_ruta_archivo($archivo_aux["id_paciente"]);
			$nombre_archivo = $ruta_archivo."historia_antigua_".mt_rand(1, 1000000).".".$extension_aux;
			
			echo("Ruta de destino: ".$nombre_archivo."<br />");
			
			//Se crea el directorio del archivo
			@mkdir($ruta_archivo, 0755, true);
			
			//Se copia el archivo en el repositorio
			$nombre_archivo_base = iconv("UTF-8", "ISO-8859-1", $archivo_aux["archivo_hc"]);
			$bol_resul = copy($ruta_base."\\".$nombre_archivo_base, $nombre_archivo);
			
			if ($bol_resul) {
				//Se actualiza el nombre del registro en la historia clínica
				$resul_aux = $dbImportarHc->editar_importar_hc($id_hc, $nombre_archivo, $id_usuario);
				$bol_resul = ($resul_aux > 0);
			}
			
			if (!$bol_resul) {
				//Se borra el archivo creado
				$dbHistoriaClinica->borrar_historia_clinica($id_hc, "Error al importar el archivo de historia antigua", $id_usuario);
			}
			
			if ($bol_resul) {
?>
<span style="color:#008800;"><b>Archivo copiado...</b></span>
<br />
<?php
		} else {
?>
<span style="color:#FF0000;"><b>Error al copiar el archivo...</b></span>
<br />
<?php
			}
			
			echo("<br />");
			flush();
		}
?>
<span style="color:#008800;"><b>Proceso finalizado.</b></span>
<br />
<?php
	} else {
?>
<span style="color:#FF0000;"><b>No se encontraron archivos pendientes de momovimiento.</b></span>
<br />
<?php
	}
?>
</body>
</html>