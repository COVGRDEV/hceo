<?php
	/*
	 * Pagina para crear consulta de optometria
	 * Autor: Feisar Moreno - 14/02/2014
	 */
 	header("Content-Type: text/xml; charset=UTF-8");
	
	require_once("../db/DbConsultaEvolucion.php");
	require_once("../db/DbMenus.php");
	require_once("../db/DbAntecedentes.php");
	
	require_once("antecedentes_funciones.php");
	require_once("../funciones/Utilidades.php");
	require_once("../funciones/Class_Atencion_Remision.php");
	require_once("../funciones/Class_Formulacion.php");
	require_once("extension_retina_ajax.php");
	require_once("extension_oculoplastia_ajax.php");
	
	function cambiar_mas($texto){
	   $resultado = str_replace("|mas", "+", $texto);
	   return $resultado;	
	}
	
	$dbConsultaEvolucion = new DbConsultaEvolucion();
	$dbMenus = new DbMenus();
	$utilidades = new Utilidades();
	
	$opcion = $_POST["opcion"];
	
	switch ($opcion) {
		case "1": //Guardar Consulta de Evolución
			$id_usuario = $_SESSION["idUsuario"];
			@$id_hc = $utilidades->str_decode($_POST["id_hc"]);
			@$id_admision = $utilidades->str_decode($_POST["id_admision"]);
			@$texto_evolucion = $utilidades->str_decode(trim($_POST["texto_evolucion"]));
			@$diagnostico_evolucion = $utilidades->str_decode(trim($_POST["diagnostico_evolucion"]));
			@$solicitud_examenes_evolucion = $utilidades->str_decode(trim($_POST["solicitud_examenes_evolucion"]));
			@$tratamiento_evolucion = $utilidades->str_decode(trim($_POST["tratamiento_evolucion"]));
			@$medicamentos_evolucion = $utilidades->str_decode(trim($_POST["medicamentos_evolucion"]));
			@$nombre_usuario_alt = $utilidades->str_decode($_POST["nombre_usuario_alt"]);
			@$ind_formula_gafas = $utilidades->str_decode($_POST["ind_formula_gafas"]);
			@$array_antecedentes_medicos_ids = $utilidades->str_decode($_POST["array_antecedentes_medicos_ids"]);
			@$array_antecedentes_medicos_val = $utilidades->str_decode($_POST["array_antecedentes_medicos_val"]);
			@$desc_antecedentes_medicos = $utilidades->str_decode($_POST["desc_antecedentes_medicos"]);
			
			@$tipo_guardar = $utilidades->str_decode($_POST["tipo_guardar"]);
			
			@$cant_ciex = intval($utilidades->str_decode($_POST["cant_ciex"]), 10);
			$array_diagnosticos = array();
			$cont_aux = 0;
			for ($i = 1; $i <= $cant_ciex; $i++) {
				if (isset($_POST["cod_ciex_".$i])) {
					@$ciex_diagnostico = $utilidades->str_decode($_POST["cod_ciex_".$i]);
					@$valor_ojos = $utilidades->str_decode($_POST["val_ojos_".$i]);
					$array_diagnosticos[$cont_aux][0] = $ciex_diagnostico;
					$array_diagnosticos[$cont_aux][1] = $valor_ojos;
					$cont_aux++;
				}
			}
			
			//Se guardan los detalles de los antecedentes
			$resultado = guardar_temp_extensiones_antec_med($id_hc, $id_usuario);
			
			if ($resultado > 0) {
				$resultado = $dbConsultaEvolucion->editar_consulta_evolucion($id_hc, $id_admision, $texto_evolucion, $array_diagnosticos, $diagnostico_evolucion,
						$solicitud_examenes_evolucion, $tratamiento_evolucion, $medicamentos_evolucion, $nombre_usuario_alt, $tipo_guardar, $id_usuario,
						$ind_formula_gafas, $array_antecedentes_medicos_ids, $array_antecedentes_medicos_val, $desc_antecedentes_medicos);
			}
			
			if ($resultado > 0) {
				//Formulación de medicamentos
				$class_formulacion = new Class_Formulacion();
				$resultado_aux = $class_formulacion->guardarFormulacionHC($id_hc, $id_usuario);
		?>
        <input type="hidden" name="hdd_exito_formulacion_fm" id="hdd_exito_formulacion_fm" value="<?php echo($resultado_aux); ?>" />
        <?php
			} else {
		?>
        <input type="hidden" name="hdd_exito_formulacion_fm" id="hdd_exito_formulacion_fm" value="1" />
        <?php
			}
			
			//Registros adicionales
			@$tipo_reg_adicional = $utilidades->str_decode($_POST["tipo_reg_adicional"]);
			switch ($tipo_reg_adicional) {
				case "2": //Retina
					$resultado = guardar_consulta_oftalmologia_retina($_POST, $id_usuario);
					break;
				case "3": //Oculoplastia
					$resultado = guardar_consulta_oculoplastia($_POST, $id_usuario);
					break;
				case "4": //Pterigio
					$resultado = guardar_consulta_pterigio($_POST, $id_usuario);
//echo "<br><br><b><i>llamé guardado Pterigio ok</i></b><br><br>"; 
					break;					
			}
			
			$reg_menu = $dbMenus->getMenu(13);
		?>
		<input type="hidden" name="hdd_exito" id="hdd_exito" value="<?php echo($resultado); ?>" />
		<input type="hidden" name="hdd_url_menu" id="hdd_url_menu" value="<?php echo($reg_menu["pagina_menu"]); ?>" />
		<input type="hidden" name="hdd_tipo_guardar" id="hdd_tipo_guardar" value="<?php echo($tipo_guardar); ?>" />
		<div class="contenedor_error" id="contenedor_error"></div>
		<div class="contenedor_exito" id="contenedor_exito"></div>
		<?php
			break;
			
		case "2": //Opciones de flujos alternativos
			$id_hc = $_POST["id_hc"];
			$id_admision = $_POST["id_admision"];
			
			$atencion_remision = new Class_Atencion_Remision();
			$atencion_remision->getFormularioRemisiones($id_hc, $id_admision, "guardar_evolucion(4, 0);", "hdd_exito");
			break;
	}
?>
