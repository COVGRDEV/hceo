function agregar_medicamento_fm() {
	var cant_formulaciones = parseInt($("#hdd_cant_formulaciones").val(), 10);
	
	if (cant_formulaciones <= 20) {
		$("#tr_formulacion_fm_" + cant_formulaciones).css("display", "table-row");
		$("#tr_formulacion_fm2_" + cant_formulaciones).css("display", "table-row");
		$("#tr_formulacion_fm3_" + cant_formulaciones).css("display", "table-row");
		
		$("#hdd_cant_formulaciones").val(cant_formulaciones + 1);
	}
}

function restar_medicamento_fm() {
	var cant_formulaciones = parseInt($("#hdd_cant_formulaciones").val(), 10) - 1;
	
	$("#hdd_cod_medicamento_fm_" + cant_formulaciones).val("");
	$("#hdd_id_tipo_medicamento_fm_" + cant_formulaciones).val("");
	$("#txt_nombre_medicamento_fm_" + cant_formulaciones).val("");
	$("#txt_presentacion_fm_" + cant_formulaciones).val("");
	$("#txt_cantidad_fm_" + cant_formulaciones).val("");
	$("#txt_dosificacion_fm_" + cant_formulaciones).val("");
	$("#txt_unidades_fm_" + cant_formulaciones).val("");
	$("#txt_duracion_fm_" + cant_formulaciones).val("");
	
	if (cant_formulaciones > 0) {
		$("#tr_formulacion_fm_" + cant_formulaciones).css("display", "none");
		$("#tr_formulacion_fm2_" + cant_formulaciones).css("display", "none");
		$("#tr_formulacion_fm3_" + cant_formulaciones).css("display", "none");
		
		$("#hdd_cant_formulaciones").val(cant_formulaciones);
	}
}

function procesar_seleccion_fm(indice) {
	var texto_base = $("#txt_nombre_medicamento_fm_" + indice).val();
	var pos_ini = texto_base.indexOf("[#");
	var pos_fin = texto_base.indexOf("#]");
	
	if (pos_ini >= 0 && pos_fin >= 0) {
		var nombre_medicamento_aux = trim(texto_base.substring(0, pos_ini - 1));
		var cadena_aux = texto_base.substring(pos_ini + 2, pos_fin);
		var arr_valores_aux = cadena_aux.split("#");
		
		if (arr_valores_aux.length == 4) {
			$("#txt_nombre_medicamento_fm_" + indice).val(nombre_medicamento_aux);
			$("#txt_presentacion_fm_" + indice).val(trim(arr_valores_aux[0]));
			$("#hdd_cod_medicamento_fm_" + indice).val(arr_valores_aux[1]);
			$("#hdd_cod_tipo_medicamento_fm_" + indice).val(arr_valores_aux[2]);
		}
	}
}

function validar_formulacion_fm() {
	var resultado = true;
	
	var cant_formulaciones = parseInt($("#hdd_cant_formulaciones").val(), 10);
	for (i = 0; i < cant_formulaciones; i++) {
		$("#txt_nombre_medicamento_fm_" + i).removeClass("bordeAdmision");
		$("#txt_cantidad_fm_" + i).removeClass("bordeAdmision");
	 	if (trim($("#txt_nombre_medicamento_fm_" + i).val()) == "" && ($("#txt_presentacion_fm_" + i).val() != "" || $("#txt_cantidad_fm_" + i).val() != "" ||
				$("#txt_dosificacion_fm_" + i).val() != "" || $("#txt_unidades_fm_" + i).val() != "" || $("#txt_duracion_fm_" + i).val() != "")) {
			$("#txt_nombre_medicamento_fm_" + i).addClass("bordeAdmision");
			resultado = false;
		}
	 	if (trim($("#txt_nombre_medicamento_fm_" + i).val()) != "" && $("#txt_cantidad_fm_" + i).val() == "") {
			$("#txt_cantidad_fm_" + i).addClass("bordeAdmision");
			resultado = false;
		}
	}
	
	return resultado;
}

function obtener_parametros_formulacion_fm() {
	var params = "";
	var cont_aux = 0;
	var cant_formulaciones = parseInt($("#hdd_cant_formulaciones").val(), 10);
	for (i = 0; i < cant_formulaciones; i++) {
		if (trim($("#txt_nombre_medicamento_fm_" + i).val()) != "") {
			params += "&nombre_medicamento_fm_" + cont_aux + "=" + str_encode($("#txt_nombre_medicamento_fm_" + i).val()) +
					  "&cod_medicamento_fm_" + cont_aux + "=" + $("#hdd_cod_medicamento_fm_" + i).val() +
					  "&cod_tipo_medicamento_fm_" + cont_aux + "=" + $("#hdd_cod_tipo_medicamento_fm_" + i).val() +
					  "&presentacion_fm_" + cont_aux + "=" + str_encode($("#txt_presentacion_fm_" + i).val()) +
					  "&cantidad_fm_" + cont_aux + "=" + $("#txt_cantidad_fm_" + i).val() +
					  "&dosificacion_fm_" + cont_aux + "=" + str_encode($("#txt_dosificacion_fm_" + i).val()) +
					  "&unidades_fm_" + cont_aux + "=" + str_encode($("#txt_unidades_fm_" + i).val()) +
					  "&duracion_fm_" + cont_aux + "=" + str_encode($("#txt_duracion_fm_" + i).val());
			
			cont_aux++;
		}
	}
	params += "&cant_formulaciones_fm=" + cont_aux;
	
	return params;
}

function copiar_formulacion_anterior_fm(id_hc) {
	var params = "opcion=1&id_hc=" + id_hc;
	
	llamarAjax("../funciones/Class_Formulacion_ajax.php", params, "d_formulacion_anterior_fm", "continuar_copiar_formulacion_anterior_fm();");
}

function continuar_copiar_formulacion_anterior_fm() {
	var cant_ant = parseInt($("#hdd_cant_ant_fm").val(), 10);
	if (cant_ant > 0) {
		$("#hdd_cant_formulaciones").val(cant_ant);
		
		for (var i = 0; i < 20; i++) {
			if (i < cant_ant) {
				$("#tr_formulacion_fm_" + i).css("display", "table-row");
				$("#tr_formulacion_fm2_" + i).css("display", "table-row");
				$("#tr_formulacion_fm3_" + i).css("display", "table-row");
				
				$("#hdd_cod_medicamento_fm_" + i).val($("#hdd_cod_medicamento_ant_fm_" + i).val());
				$("#hdd_cod_tipo_medicamento_fm_" + i).val($("#hdd_cod_tipo_medicamento_ant_fm_" + i).val());
				$("#txt_nombre_medicamento_fm_" + i).val($("#hdd_nombre_medicamento_ant_fm_" + i).val());
				$("#txt_presentacion_fm_" + i).val($("#hdd_presentacion_ant_fm_" + i).val());
				$("#txt_cantidad_fm_" + i).val($("#hdd_cantidad_ant_fm_" + i).val());
				$("#txt_dosificacion_fm_" + i).val($("#hdd_dosificacion_ant_fm_" + i).val());
				$("#txt_unidades_fm_" + i).val($("#hdd_unidades_ant_fm_" + i).val());
				$("#txt_duracion_fm_" + i).val($("#hdd_duracion_ant_fm_" + i).val());
			} else {
				if (i > 0) {
					$("#tr_formulacion_fm_" + i).css("display", "none");
					$("#tr_formulacion_fm2_" + i).css("display", "none");
					$("#tr_formulacion_fm3_" + i).css("display", "none");
				}
				
				$("#hdd_cod_medicamento_fm_" + i).val("");
				$("#hdd_id_tipo_medicamento_fm_" + i).val("");
				$("#txt_nombre_medicamento_fm_" + i).val("");
				$("#txt_presentacion_fm_" + i).val("");
				$("#txt_cantidad_fm_" + i).val("");
				$("#txt_dosificacion_fm_" + i).val("");
				$("#txt_unidades_fm_" + i).val("");
				$("#txt_duracion_fm_" + i).val("");
			}
		}
	} else {
		alert("No se encontraron formulaciones anteriores");
	}
}

function borrar_medicamento_fm(indice) {
	var cant_formulaciones = parseInt($("#hdd_cant_formulaciones").val(), 10);
	
	$("#hdd_cod_medicamento_fm_" + indice).val("");
	$("#hdd_id_tipo_medicamento_fm_" + indice).val("");
	$("#txt_nombre_medicamento_fm_" + indice).val("");
	$("#txt_presentacion_fm_" + indice).val("");
	$("#txt_cantidad_fm_" + indice).val("");
	$("#txt_dosificacion_fm_" + indice).val("");
	$("#txt_unidades_fm_" + indice).val("");
	$("#txt_duracion_fm_" + indice).val("");
	
	if (cant_formulaciones > 1) {
		$("#tr_formulacion_fm_" + indice).css("display", "none");
		$("#tr_formulacion_fm2_" + indice).css("display", "none");
		$("#tr_formulacion_fm3_" + indice).css("display", "none");
		
		var cant_aux = 0;
		for (var i = 0; i < 20; i++) {
			if ($("#tr_formulacion_fm_" + i).is(":visible")) {
				cant_aux = i;
			}
		}
		cant_aux++;
		$("#hdd_cant_formulaciones").val(cant_aux);
	}
}

function mostrar_crear_medicamento_fm(id_hc) {
	$("#d_interno").html("");
	mostrar_formulario_flotante(1);
	reducir_formulario_flotante(950, "auto");
	$("#d_interno").css("width", "100%");
	posicionarDivFlotante("d_centro");
	
	var params = "opcion=2&id_hc=" + id_hc;
	
	llamarAjax("../funciones/Class_Formulacion_ajax.php", params, "d_interno", "");
}

function crear_medicamento_fm() {
	$("#btn_crear_medicamento_fm").attr("disabled", "disabled");
	$("#d_contenedor_error_fm").css("display", "none");
	$("#d_contenedor_exito_fm").css("display", "none");
	if (validar_crear_medicamento_fm() == 1) {
		var params = "opcion=3&nombre_comercial=" + str_encode($("#txt_nombre_comercial_fm").val()) +
					 "&nombre_generico=" + str_encode($("#txt_nombre_generico_fm").val()) +
					 "&presentacion=" + str_encode($("#txt_presentacion_fm").val()) +
					 "&concentracion=" + str_encode($("#txt_concentracion_fm").val()) +
					 "&grupo_terapeutico=" + str_encode($("#txt_grupo_terapeutico_fm").val()) +
					 "&laboratorio=" + str_encode($("#txt_laboratorio_fm").val()) +
					 "&ind_pos=" + $("#cmb_pos_fm").val() +
					 "&id_lugar_cita=" + $("#cmb_lugar_cita_fm").val();
		
		llamarAjax("../funciones/Class_Formulacion_ajax.php", params, "d_crear_medicamento_fm", "finalizar_crear_medicamento_fm();");
	} else {
		$("#btn_crear_medicamento_fm").removeAttr("disabled");
		$("#d_contenedor_error_fm").html("Los datos marcados en rojo son obligatorios");
		$("#d_contenedor_error_fm").css("display", "block");
	}
}

function validar_crear_medicamento_fm() {
	var resultado = 1;
	$("#txt_nombre_comercial_fm").removeClass("borde_error");
	$("#txt_nombre_generico_fm").removeClass("borde_error");
	$("#txt_presentacion_fm").removeClass("borde_error");
	$("#cmb_pos_fm").removeClass("borde_error");
	
	if (trim($("#txt_nombre_comercial_fm").val()) == "") {
		$("#txt_nombre_comercial_fm").addClass("borde_error");
		resultado = 0;
	}
	if (trim($("#txt_nombre_generico_fm").val()) == "") {
		$("#txt_nombre_generico_fm").addClass("borde_error");
		resultado = 0;
	}
	if (trim($("#txt_presentacion_fm").val()) == "") {
		$("#txt_presentacion_fm").addClass("borde_error");
		resultado = 0;
	}
	if (trim($("#cmb_pos_fm").val()) == "") {
		$("#cmb_pos_fm").addClass("borde_error");
		resultado = 0;
	}
	
	return resultado;
}

function finalizar_crear_medicamento_fm() {
	$("#btn_crear_medicamento_fm").removeAttr("disabled");
	var cod_medicamento = $("#hdd_cod_medicamento_r_fm").val();
	
	switch (cod_medicamento) {
		case "-1":
			$("#d_contenedor_error_fm").html("Error interno al tratar de crear el medicamento");
			$("#d_contenedor_error_fm").css("display", "block");
			break;
		case "-2":
			$("#d_contenedor_error_fm").html("Error al tratar de crear el medicamento");
			$("#d_contenedor_error_fm").css("display", "block");
			break;
		default: //Éxito
			$("#d_contenedor_exito_fm").css("display", "block");
			$("#d_contenedor_exito_fm").html("Datos guardados correctamente");
			
			//Se agrega el medicamento a la formulación
			var indice = parseInt($("#hdd_cant_formulaciones").val(), 10) - 1;
			if (trim($("#txt_nombre_medicamento_fm_" + indice).val()) != "" && trim($("#txt_presentacion_fm_" + indice).val()) != "") {
				agregar_medicamento_fm();
				indice++;
			}
			
			$("#hdd_cod_medicamento_fm_" + indice).val(cod_medicamento);
			$("#hdd_cod_tipo_medicamento_fm_" + indice).val(2);
			$("#txt_nombre_medicamento_fm_" + indice).val($("#hdd_nombre_comercial_r_fm").val() + " (" + $("#hdd_nombre_generico_r_fm").val() + ")");
			$("#txt_presentacion_fm_" + indice).val($("#hdd_presentacion_r_fm").val());
			
			setTimeout("cerrar_div_centro();", 2000);
			break;
	}
}
