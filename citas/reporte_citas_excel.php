<?php
	session_start();
	
	/** Include PHPExcel */
	require_once '../funciones/PHPExcel/Classes/PHPExcel.php';
	require_once("../db/DbCitas.php");
	require_once '../db/DbListas.php';
	require_once("../funciones/FuncionesPersona.php");
	require_once("../db/DbVariables.php");
	
	$citas = new DbCitas();
	$listas = new DbListas();
	$funciones_persona = new FuncionesPersona();
	$dbVariables = new Dbvariables();
	
		//Descarga EXCEL
		// Create new PHPExcel object
	$objPHPExcel = new PHPExcel();
	
	$profesional = $_POST['hddProfesional'];
	$lugar = $_POST['hddLugar'];
	//$estado = $_POST['hddEstado'];
	$fechaInicial = $_POST['hddFechaInicial'];
	$fechaFinal = $_POST['hddFechaFinal'];
	$cita = $_POST['hddCita'];
	$tipoCita = $_POST['hddTipoCita'];
	$hora = $_POST['hddHora'];
    
	$convenio = $_POST['convenio'];
	
	//Enviar el array a la funcion buscar
	$contadorTp = $_POST['contadorTp'];
	$tiposCitas = array();
	for ($a = 1; $a <= $contadorTp; $a++) {
		$tiposCitas[$a] = $_POST['tp' . $a];
	}
	
	

	$arr_diferencia = $dbVariables->getDiferenciaFechas($fechaInicial, $fechaFinal, 2);
	$diferencia_dias = intval($arr_diferencia["dias"], 10);
	
	//echo $fechaInicial."#".$fechaFinal."#".$tipo_formato;
	
	if($diferencia_dias >= 34){
		//Arroja error 
		?>
			<script id="ajax" type="text/javascript">
				alert("Existe más de un mes entre las fechas seleccionadas");
				window.close();
			</script>
		<?php
	}
		else{
					
		function operacion_horas($hora, $minutos, $tipo, $cantidad, $formato) {
			if ($tipo == 1) { //Sumar minutos
				$horaInicial = $hora . ":" . $minutos;
				$segundos_horaInicial = strtotime($horaInicial);
				$segundos_minutoAnadir = $cantidad * 60;
				$nuevaHora = date("H:i", $segundos_horaInicial + $segundos_minutoAnadir);
			} else if ($tipo == 2) { //Restar minutos
				$horaInicial = $hora . ":" . $minutos;
				$segundos_horaInicial = strtotime($horaInicial);
				$segundos_minutoAnadir = $cantidad * 60;
				$nuevaHora = date("H:i", $segundos_horaInicial - $segundos_minutoAnadir);
			}
		
			if ($formato == 12) {
				$hora_nueva = explode(":", $nuevaHora);
				$hora_resultado = mostrar_hora_format($hora_nueva[0], $hora_nueva[1]);
			} else {
				$hora_resultado = $nuevaHora;
			}
		
			return $hora_resultado;
		}
		
		//Devulve la hora en formato 12 horas con la jornada
		function mostrar_hora_format($hora, $minutos) {
			$hora = cifras_numero($hora, 2);
			$minutos = cifras_numero($minutos, 2);
		
			$hora_res = '';
			if ($hora > 12) {
				$hora = $hora - 12;
				$hora_res = $hora . ":" . $minutos . " PM";
			} else {
				$hora_res = $hora . ":" . $minutos . " AM";
			}
		
			return $hora_res;
		}
		
		function cifras_numero($consecutivo, $cifras) {
			$longitud = strlen($consecutivo);
			while ($longitud <= $cifras - 1) {
				$consecutivo = "0" . $consecutivo;
				$longitud = strlen($consecutivo);
			}
			return $consecutivo;
		}
		
				
			$rta_aux = $citas->getReporteCitas($profesional, $lugar, $fechaInicial, $fechaFinal, $cita, 1, $tipoCita, $hora, $tiposCitas, $convenio);
			//var_dump($rta_aux);
	
	// Set document properties
	$objPHPExcel->getProperties()->setCreator("Maarten Balliauw")
			->setLastModifiedBy("Maarten Balliauw")
			->setTitle("Office 2007 XLSX Test Document")
			->setSubject("Office 2007 XLSX Test Document")
			->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
			->setKeywords("office 2007 openxml php")
			->setCategory("Test result file");
	
	// Add some data
	$objPHPExcel->setActiveSheetIndex(0)
			->setCellValue('A1', 'No.')
			->setCellValue('B1', 'Fecha cita')
			->setCellValue('C1', 'Hora cita')
			->setCellValue('D1', 'Documento')
			->setCellValue('E1', 'Paciente')
			->setCellValue('F1', 'Telefono')
			->setCellValue('G1', 'Lugar cita')
			->setCellValue('H1', 'Convenio')
			->setCellValue('I1', 'Prof')
			->setCellValue('J1', 'Observación')
			->setCellValue('K1', 'Tipo de cita')
			->setCellValue('L1', 'Estado')
			->setCellValue('M1', 'Usuario crea')
			->setCellValue('N1', 'Fecha crea')
			->setCellValue('O1', 'Usuario última modificación')
			->setCellValue('P1', 'Fecha modificación')
			->setCellValue('Q1', 'Fecha cita')
			->setCellValue('R1', 'Hora cita');
	
	$contador = 2;
	$contador2 = 1;
	
	foreach ($rta_aux as $value) {
		$anio_cita_aux = substr($value['fecha_cita'], 0, 4);
                $mes_cita_aux = substr($value['fecha_cita'], 5, 2);
                $dia_cita_aux = substr($value['fecha_cita'], 8, 2);
		//$fecha_cita_aux = strtotime($fecha_cita_aux);
	
		$hora = substr($value['hora_aux'], 0, 2);
		$minutos = substr($value['hora_aux'], 3, 4);
		$hora_cita = operacion_horas(intval($hora), intval($minutos), 1, 0, 12);
	
		$paciente_aux = '';
		if (strlen($value['nombre_1'] . ' ' . $value['nombre_2'] . ' ' . $value['apellido_1']) >= 25) {
			$paciente_aux = substr($value['nombre_1'] . ' ' . $value['nombre_2'] . ' ' . $value['apellido_1'], 0, 25) . '...';
		} else {
			$paciente_aux = $value['nombre_1'] . ' ' . $value['nombre_2'] . ' ' . $value['apellido_1'];
		}
	
		$convenio_aux = '';
		if (strlen($value['nombre_convenio_aux']) >= 17) {
			$convenio_aux = substr($value['nombre_convenio_aux'], 0, 17) . '...';
		} else {
			$convenio_aux = $value['nombre_convenio_aux'];
		}
		$nombre_tipo_cita = $value['nombre_tipo_cita'];
		$estado_cita = $value['nombre_detalle'];
		$lugar_cita = $listas->getDetalle($value['id_lugar_cita']);
		$telefono = $value['telefono_contacto'];
		
		$objPHPExcel->setActiveSheetIndex(0)
				->setCellValue('A' . $contador, $contador2)
				->setCellValue('B' . $contador, $dia_cita_aux.'/'.$mes_cita_aux.'/'.$anio_cita_aux)
				->setCellValue('C' . $contador, $hora_cita)
				->setCellValue('D' . $contador, $value['numero_documento'])
				->setCellValue('E' . $contador, $paciente_aux)
				->setCellValue('F' . $contador, $telefono)
				->setCellValue('G' . $contador, $lugar_cita['nombre_detalle'])
				->setCellValue('H' . $contador, $convenio_aux)
				->setCellValue('I' . $contador, substr($value['nombre_usuario'], 0, 1) . substr($value['apellido_usuario'], 0, 1))
				->setCellValue('J' . $contador, html_entity_decode($value['observacion_cita']))
				->setCellValue('K' . $contador, $nombre_tipo_cita)
				->setCellValue('L' . $contador, $estado_cita)
				->setCellValue('M' . $contador, $value['nombre_usuario_crea'])
				->setCellValue('N' . $contador, $value['fecha_crea_t']." ".$value['hora_crea_t'])
				->setCellValue('O' . $contador, $value['nombre_usuario_modifica'])
				->setCellValue('P' . $contador, $value['fecha_mod_t']." ".$value['hora_mod_t'])
				->setCellValue('Q' . $contador, $value['fecha_cita_t'] )
				->setCellValue('R' . $contador, $value['hora_cita_t']);
				
				
		$contador++;
		$contador2++;
	}
	
	$objSheet = $objPHPExcel->getActiveSheet();
	
	$objSheet->getColumnDimension('A')->setWidth(7.71);
	$objSheet->getColumnDimension('B')->setWidth(19.57);
	$objSheet->getColumnDimension('C')->setWidth(15);
	$objSheet->getColumnDimension('D')->setWidth(15);
	$objSheet->getColumnDimension('E')->setWidth(30.14);
	$objSheet->getColumnDimension('F')->setWidth(15);
	$objSheet->getColumnDimension('G')->setWidth(15);
	$objSheet->getColumnDimension('H')->setWidth(5.86);
	$objSheet->getColumnDimension('I')->setWidth(15);
	$objSheet->getColumnDimension('J')->setWidth(30);
	$objSheet->getColumnDimension('K')->setWidth(30);
	$objSheet->getColumnDimension('L')->setWidth(30.14);
	$objSheet->getColumnDimension('M')->setWidth(19.57);
	$objSheet->getColumnDimension('N')->setWidth(15);
	$objSheet->getColumnDimension('O')->setWidth(15);
	$objSheet->getColumnDimension('P')->setWidth(15);
	
	// Rename worksheet
	$objPHPExcel->getActiveSheet()->setTitle('Reporte de citas');
	
	// Set active sheet index to the first sheet, so Excel opens this as the first sheet
	$objPHPExcel->setActiveSheetIndex(0);
	
	//Se borra el reporte previamente generado por el usuario
	@unlink("./tmp/reporte_citas_".$id_usuario.".xlsx");
	
	// Save Excel 2007 file
	$id_usuario = $_SESSION["idUsuario"];
	$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
	$objWriter->save("./tmp/reporte_citas_".$id_usuario.".xlsx");
?>
<form name="frm_reporte_citas" id="frm_reporte_citas" method="post" action="tmp/reporte_citas_<?php echo($id_usuario); ?>.xlsx"></form>
<script id="ajax" type="text/javascript">
	document.getElementById("frm_reporte_citas").submit();
</script>
<?php
	exit;

		
		}
?>	
	
