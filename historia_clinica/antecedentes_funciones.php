<?php
	function guardar_temp_extensiones_antec_med($id_hc, $id_usuario) {
		$dbAntecedentes = new DbAntecedentes();
		$utilidades = new Utilidades();
		
		@$cant_antec_extensiones = intval($_POST["cant_antec_extensiones"], 10);
		
		$mapa_antec_extensiones = array();
		for ($i = 0; $i < $cant_antec_extensiones; $i++) {
			@$id_antecedentes_medicos = $utilidades->str_decode($_POST["id_antec_extension_".$i]);
			
			@$cant_antec_extension_det = intval($_POST["cant_antec_extension_".$i], 10);
			if ($cant_antec_extension_det > 0) {
				$mapa_antec_extensiones[$id_antecedentes_medicos] = array();
				for ($j = 0; $j < $cant_antec_extension_det; $j++) {
					$arr_aux = array();
					@$arr_aux["nombre_tipo"] = $utilidades->str_decode($_POST["nombre_tipo_antec_med_".$i."_".$j]);
					@$arr_aux["nombre_profesional"] = $utilidades->str_decode($_POST["nombre_profesional_antec_med_".$i."_".$j]);
					@$arr_aux["fecha_det"] = $utilidades->str_decode($_POST["fecha_det_antec_med_".$i."_".$j]);
					
					array_push($mapa_antec_extensiones[$id_antecedentes_medicos], $arr_aux);
				}
			}
		}
		
		//Se guarda la formulación
		$resultado = $dbAntecedentes->guardar_temporal_antec_med_det($id_hc, $mapa_antec_extensiones, $id_usuario);
		
		return $resultado;
	}
	
	function obtener_antecedente_detalle($indice, $tipo_extension, $antecedente_det_obj) {
		switch ($tipo_extension) {
			case "1": //Descripción-Profesional-Fecha
				$nombre_tipo_aux = "";
				$nombre_profesional_aux = "";
				$fecha_det_aux = "";
				if (count($antecedente_det_obj) > 0) {
					$nombre_tipo_aux = $antecedente_det_obj["nombre_tipo"];
					$nombre_profesional_aux = $antecedente_det_obj["nombre_profesional"];
					$fecha_det_aux = $antecedente_det_obj["fecha_det_t"];
				}
		?>
        <table cellpadding="3" cellspacing="0" style="width:100%;">
           	<tr>
               	<td style="width:50%;">
                   	<input type="text" id="txt_nombre_tipo_antec_med_<?php echo($indice); ?>" class="no-margin" style="width:100%;" maxlength="200" value="<?php echo($nombre_tipo_aux); ?>" placeholder="Descripci&oacute;n" />
                </td>
               	<td style="width:30%;">
                   	<input type="text" id="txt_nombre_profesional_antec_med_<?php echo($indice); ?>" class="no-margin" style="width:100%;" maxlength="50" value="<?php echo($nombre_profesional_aux); ?>" placeholder="Profesional" />
                </td>
               	<td style="width:20%;">
                	<input type="text" id="txt_fecha_det_antec_med_<?php echo($indice); ?>" class="no-margin" style="width:120px;" maxlength="10" value="<?php echo($fecha_det_aux); ?>" placeholder="Fecha" onkeyup="DateFormat(this, this.value, event, false, '3');" onfocus="vDateType = '3';" onBlur="DateFormat(this, this.value, event, true, '3');" />
                </td>
            </tr>
        </table>
        <?php
				break;
		}
	}
	
	function obtener_listado_contactos() {
		//Div flotante de contactos médicos relacionados
?>
<div id="d_contactos_antecedentes" class="div_panel_der" style="display:none;">
	<div class="a_cierre_panel" onclick="abrir_cerrar_contactos_antecedentes_med();"></div>
    <div id="d_height">
        <div id="d_header">
            <div><b>Contactos</b></div>
        </div>
        <div id="d_interno_contactos_antecedentes">(Sin contactos)</div>
    </div>
</div>
<script type="text/javascript" id="ajax">
	ver_contactos_antecedentes_med();
</script>
<?php
	}
?>
