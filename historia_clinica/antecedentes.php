<?php
	require_once("../db/DbAntecedentes.php");
	require_once("antecedentes_funciones.php");
	require_once("../funciones/Class_Combo_Box.php");
	require_once("../db/DbVariables.php");	
	
	$dbAntecedentes = new DbAntecedentes();
	$dbVariables =  new Dbvariables();
	
	
	$combo_box = new Combo_Box();
	
	//Formato actual de antecedentes
	$mensaje_HC = $dbVariables->getVariable(23);
	
	//Formato actual de antecedentes
	$lista_antecedentes = $dbAntecedentes->get_lista_antecedentes_medicos_hc2($id_hc_consulta);
	
	//Formato anterior de antecedentes
	$lista_antecedentes_medicos = $dbAntecedentes->get_lista_antecedentes_medicos_hc($id_hc_consulta);
	$lista_antecedentes_otros = $dbAntecedentes->get_lista_antecedentes_otros_hc($id_hc_consulta);
	
	if (!isset($ind_antecedentes_ant)) {
		$ind_antecedentes_ant = "0";
	}
?>
<input type="hidden" id="hdd_cant_antecedentes" value="<?php echo(count($lista_antecedentes)); ?>" />
<?php
	if (count($lista_antecedentes) > 0) {
		for ($i = 0; $i < count($lista_antecedentes); $i++) {
			$antecedente_aux = $lista_antecedentes[$i];
?>
<input type="hidden" id="hdd_ant_med_<?php echo($i); ?>" value="<?php echo($antecedente_aux["id_antecedentes_medicos"]); ?>" />
<input type="hidden" id="hdd_nombre_ant_med_<?php echo($i); ?>" value="<?php echo($antecedente_aux["nombre_antecedentes_medicos"]); ?>" />
<input type="hidden" id="hdd_ant_med_padre_<?php echo($i); ?>" value="<?php echo($antecedente_aux["id_antecedentes_medicos_padre"]); ?>" />
<input type="hidden" id="hdd_nivel_ant_med_<?php echo($i); ?>" value="<?php echo($antecedente_aux["nivel"]); ?>" />
<input type="hidden" id="hdd_orden_ant_med_<?php echo($i); ?>" value="<?php echo($antecedente_aux["orden"]); ?>" />
<input type="hidden" id="hdd_hc_consulta_<?php echo($i); ?>" value="<?php echo($id_hc_consulta); ?>" />
<?php
		}
		
		//Se verifica si se deben mostrar o no inicialmente los antecedentes
		if (isset($_POST['tipo_entrada'])) {
			//Mostrar
			$ind_mostrar = true;
		} else {
			//Ocultar
			$ind_mostrar = false;
		}
?>
<table border="0" cellpadding="3" cellspacing="0" align="center" style="width:98%;">
	<?php
    	if (!isset($ind_sin_refrac_ant) || !$ind_sin_refrac_ant) {
	?>
    <tr>
    	<td align="left">
        	<?php
				//Lista para campos Sí/No
				$lista_con_sin = array();
				$lista_con_sin[0]["id"] = "1";
				$lista_con_sin[0]["valor"] = "Con";
				$lista_con_sin[1]["id"] = "0";
				$lista_con_sin[1]["valor"] = "Sin";
				
				$combo_box->getComboDb("cmb_antec_cx_refrac", $ind_antec_cx_refrac, $lista_con_sin, "id,valor", "--Seleccione--", "", 1, "", "", "no-margin");
			?>
            &nbsp;<b>antecedentes de cirug&iacute;a refractiva (LASIK, PRK, T-PRK, Queratotom&iacute;a radial, etc.).*</b>
        </td>
    </tr>
    <tr style="height:5px;"></tr>
    <?php
		}
	?>
	<tr>
		<td align="center">
			<h5 style="margin:0px; display:inline;">Antecedentes y revisi&oacute;n por sistemas</h5>
            <img id="img_mostrar_antecedentes" class="img_button" style="margin:0; display:<?php echo($ind_mostrar ? "inline" : "none"); ?>;" onclick="ver_listado_antecedentes(true);" src="../imagenes/icon-blue-down.png" title="Mostrar listado de antecedentes" />
            <img id="img_ocultar_atencedentes" class="img_button" style="margin:0; display:<?php echo($ind_mostrar ? "none" : "inline"); ?>;" onclick="ver_listado_antecedentes(false);" src="../imagenes/icon-blue-up.png" title="Ocultar listado de antecedentes" />
		</td>
	</tr>
    <tr>
        <td align="left">
            <div id="d_lista_antecedentes" style="display:<?php echo($ind_mostrar ? "none" : "block"); ?>;">
            	<img src="../imagenes/add_elemento.png" class="img_button" style="float:right;" title="Ver contactos" onclick="abrir_cerrar_contactos_antecedentes_med();" />
                <h6>Sufre de:<br />
                    <?php
						$cadena_ant_padres = "";
						$arr_checked_aux = array();
						$arr_antec_extensiones = array();
						$cont_antec_extensiones = 0;
						$sexo_paciente = $datos_paciente["sexo"];
						for ($i = 0; $i < count($lista_antecedentes); $i++) {
							$antecedente_aux = $lista_antecedentes[$i];
							$checked_aux = "";
							if ($antecedente_aux["valor_antecedentes_medicos"] == "1") {
								$checked_aux = "checked=\"checked\"";
							}
							
							if ($antecedente_aux["nivel"] == "1") {
								if ($cadena_ant_padres != "") {
									$cadena_ant_padres .= ",";
								}
								$cadena_ant_padres .= $i;
								
								$funcion_cambio = "";
								if ($antecedente_aux["tipo_extension"] != "0") {
									array_push($arr_antec_extensiones, $antecedente_aux);
									$funcion_cambio = "extender_antecedente_medico(".$i.", ".$cont_antec_extensiones.");";
									$cont_antec_extensiones++;
								} else {
									$funcion_cambio = "seleccionar_antecedente_medico('".$i."', '');";
								}
					?>
                    <div style="height:7px;"></div>
                    <?php
								echo("<b>".$antecedente_aux["titulo_antecedente_medico"]."</b>");
					?><input type="checkbox" id="chk_ant_med_<?php echo($i) ?>" class="no-margin" onchange="<?php echo($funcion_cambio); ?>" <?php echo($checked_aux); ?> /><?php
								echo("<br />&nbsp;&nbsp;&nbsp;&nbsp;");
								//Se cargan los antecedentes de segundo nivel
								$ind_primero_ant = true;
								$cadena_ant_hijos = "";
								for ($j = 0; $j < count($lista_antecedentes); $j++) {
									$antecedente_hijo_aux = $lista_antecedentes[$j];
									if ($antecedente_hijo_aux["nivel"] == "2" && $antecedente_hijo_aux["id_antecedentes_medicos_padre"] == $antecedente_aux["id_antecedentes_medicos"]) {
										if ($sexo_paciente == $antecedente_hijo_aux["sexo"] || $antecedente_hijo_aux["sexo"] == "") {
											$funcion_cambio = "";
											if ($antecedente_hijo_aux["tipo_extension"] != "0") {
												array_push($arr_antec_extensiones, $antecedente_hijo_aux);
												$funcion_cambio = "extender_antecedente_medico(".$j.", ".$cont_antec_extensiones.");";
												$cont_antec_extensiones++;
											} else {
												$funcion_cambio = "seleccionar_antecedente_medico('".$j."', '".$i."');";
											}
											
											if ($cadena_ant_hijos != "") {
												$cadena_ant_hijos .= ",";
											}
											$cadena_ant_hijos .= $j;
											
											$checked_aux = "";
											if ($antecedente_hijo_aux["valor_antecedentes_medicos"] == "1") {
												$checked_aux = "checked=\"checked\"";
											}
											
											if (!$ind_primero_ant) {
												echo(",&nbsp;");
											}
											echo($antecedente_hijo_aux["titulo_antecedente_medico"]);
					?><input type="checkbox" id="chk_ant_med_<?php echo($j) ?>" class="no-margin" onchange="<?php echo($funcion_cambio); ?>" <?php echo($checked_aux); ?> /><?php
											$ind_primero_ant = false;
										}
									}
								}
								echo("<br />");
					?>
                    <input type="hidden" id="hdd_ant_med_hijos_<?php echo($i); ?>" value="<?php echo($cadena_ant_hijos); ?>" />
                    <?php
							}
						}
					?>
                    <input type="hidden" id="hdd_ant_med_padres" value="<?php echo($cadena_ant_padres); ?>" />
                    <input type="hidden" id="hdd_cant_antec_extensiones" value="<?php echo($cont_antec_extensiones); ?>" />
	    		</h6>
            </div>
        </td>
    </tr>
    <?php
		$cadena_ant_medicos = "";
		$cadena_ant_otros = "";
		if ($ind_antecedentes_ant == "1") {
			//Se arma el listado de antecedentes médicos del formato anterior
			$cadena_ant_medicos = "";
			if (count($lista_antecedentes_medicos) > 0) {
				foreach ($lista_antecedentes_medicos as $antecedente_aux) {
					if ($cadena_ant_medicos != "") {
						$cadena_ant_medicos .= ", ";
					}
					$cadena_ant_medicos .= $antecedente_aux["nombre_antecedentes_medicos"];
				}
			}
			
			//Se arma el listado de otros antecedentes del formato anterior
			$cadena_ant_otros = "";
			if (count($lista_antecedentes_otros) > 0) {
				foreach ($lista_antecedentes_otros as $antecedente_aux) {
					if ($cadena_ant_otros != "") {
						$cadena_ant_otros .= "<p>&nbsp;</p>";
					}
					$cadena_ant_otros .= $utilidades->ajustar_texto_wysiwyg("<strong>".$antecedente_aux["nombre_antecedentes_otros"].":</strong>&nbsp;".$antecedente_aux["valor_antecedentes_otros"]);
				}
			}
		}
		
		$cadena_antecedentes = "";
		if ($cadena_ant_medicos != "") {
			$cadena_antecedentes = "<p>".$cadena_ant_medicos."</p>";
		}
		if ($desc_antecedentes_medicos != "") {
			$cadena_antecedentes .= $utilidades->ajustar_texto_wysiwyg($desc_antecedentes_medicos);
		}
		if ($cadena_ant_otros != "") {
			if ($cadena_antecedentes != "") {
				$cadena_antecedentes .= "<p>&nbsp;</p>";
			}
			$cadena_antecedentes .= $cadena_ant_otros;
		}
		
		//Acá pinta el componente Mensaje HC
	?>
	<tr>
		<td align="left">
            <div id="txt_desc_antecedentes_medicos"><?php echo($cadena_antecedentes); ?></div>
        </td>
    </tr>
    <?php
		//Se obtiene el listado de detalles de antecedentes
		$lista_hc_antecedentes_med_det = $dbAntecedentes->get_lista_hc_antecedentes_medicos_det($id_hc_consulta);
		$mapa_hc_antecedentes_med_det = array();
		foreach ($lista_hc_antecedentes_med_det as $antecedente_aux) {
			if (!isset($mapa_hc_antecedentes_med_det[$antecedente_aux["id_antecedentes_medicos"]])) {
				$mapa_hc_antecedentes_med_det[$antecedente_aux["id_antecedentes_medicos"]] = array();
			}
			array_push($mapa_hc_antecedentes_med_det[$antecedente_aux["id_antecedentes_medicos"]], $antecedente_aux);
		}
		
    	for ($i = 0; $i < $cont_antec_extensiones; $i++) {
			$antecedente_aux = $arr_antec_extensiones[$i];
			$display_aux = "none";
			$lista_antecedentes_det = array();
			if (isset($mapa_hc_antecedentes_med_det[$antecedente_aux["id_antecedentes_medicos"]])) {
				$lista_antecedentes_det = $mapa_hc_antecedentes_med_det[$antecedente_aux["id_antecedentes_medicos"]];
				if (count($lista_antecedentes_det) > 0 && $lista_antecedentes_det[0]["valor_antecedentes_medicos"] == "1") {
					$display_aux = "table-row";
				}
			}
	?>
    <tr id="tr_antec_extension_<?php echo($i); ?>" style="display:<?php echo($display_aux); ?>;">
    	<td align="left">
        	<input type="hidden" id="hdd_id_antec_extension_<?php echo($i); ?>" value="<?php echo($antecedente_aux["id_antecedentes_medicos"]); ?>" />
        	<input type="hidden" id="hdd_tipo_antec_extension_<?php echo($i); ?>" value="<?php echo($antecedente_aux["tipo_extension"]); ?>" />
        	<input type="hidden" id="hdd_cant_antec_extension_<?php echo($i); ?>" value="<?php echo(count($lista_antecedentes_det)); ?>" />
        	<h6>
	        	<b><?php echo($antecedente_aux["nombre_antecedentes_medicos"]); ?></b>
            </h6>
            <div id="d_content_antec_extension_<?php echo($i); ?>">
            	<?php
                	for ($j = 0; $j < count($lista_antecedentes_det); $j++) {
				?>
                <div id="d_det_antec_extension_<?php echo($i."_".$j); ?>">
                	<?php
                    	obtener_antecedente_detalle($i."_".$j, $antecedente_aux["tipo_extension"], $lista_antecedentes_det[$j]);
					?>
                </div>
                <?php
					}
				?>
            </div>
            <div>
                <div class="agregar_alemetos" onclick="agregar_antec_extension(<?php echo($i); ?>);"></div>
                <div class="restar_alemetos" onclick="quitar_antec_extension(<?php echo($i); ?>);"></div>
            </div>
        </td>
    </tr>
    <?php
		}
	?>
</table>
<?php
	}
?>
