// JavaScript Document

function ver_listado_antecedentes(ind_ver) {
	if (ind_ver) {
		$("#d_lista_antecedentes").show(200);
		$("#img_mostrar_antecedentes").hide();
		$("#img_ocultar_atencedentes").show();
	} else {
		$("#d_lista_antecedentes").hide(200);
		$("#img_ocultar_atencedentes").hide();
		$("#img_mostrar_antecedentes").show();
	}
}

function seleccionar_antecedente_medico(indice, indice_padre) {
	var txt_base = CKEDITOR.instances.txt_desc_antecedentes_medicos.getData();
	
	var txt_busq = "";
	var txt_busq_padre = "";
	var pos_padre_aux = -1;
	if (indice_padre != "") {
		txt_busq_padre = "<p><strong>" + remplazar_acentos($("#hdd_nombre_ant_med_" + indice_padre).val(), "H") + ":</strong>";
		pos_padre_aux = txt_base.indexOf(txt_busq_padre);
		txt_busq = "<p>&nbsp;&nbsp;&nbsp;&nbsp;" + remplazar_acentos($("#hdd_nombre_ant_med_" + indice).val(), "H") + ":";
	} else {
		txt_busq = "<p><strong>" + remplazar_acentos($("#hdd_nombre_ant_med_" + indice).val(), "H") + ":</strong>";
	}
	var pos_aux = txt_base.indexOf(txt_busq);
	
	if ($("#chk_ant_med_" + indice).is(":checked")) {
		//Se verifica que se haya seleccionado al padre, de no ser así, se selecciona
		if (indice_padre != "" && !$("#chk_ant_med_" + indice_padre).is(":checked")) {
			$("#chk_ant_med_" + indice_padre).prop("checked", true);
		}
		
		if (pos_aux == -1) {
			if (indice_padre == "") {
				//Padres
				txt_base = insertar_antecedente_padre(indice, txt_base);
			} else {
				//Hijos
				var arr_hijos = $("#hdd_ant_med_hijos_" + indice_padre).val().split(",");
				var arr_padres = $("#hdd_ant_med_padres").val().split(",");
				
				if (pos_padre_aux == -1) {
					txt_base = insertar_antecedente_padre(indice_padre, txt_base);
					pos_padre_aux = txt_base.indexOf(txt_busq_padre);
				}
				
				//Se busca la prosición del padre en el arreglo
				var indice_arr = -1;
				for (var i = 0; i < arr_padres.length; i++) {
					if (arr_padres[i] == indice_padre) {
						indice_arr = i;
						break;
					}
				}
				
				//Se busca en el texto la posición del primer antecedente padre posterior
				var pos_padre_post_aux = -1;
				for (var i = indice_arr + 1; i < arr_padres.length; i++) {
					var txt_busq_post = "<p><strong>" + remplazar_acentos($("#hdd_nombre_ant_med_" + arr_padres[i]).val(), "H") + ":";
					pos_padre_post_aux = txt_base.indexOf(txt_busq_post);
					if (pos_padre_post_aux >= 0) {
						break;
					}
				}
				
				//Se busca la posición del antecedente en el arreglo de hijos
				indice_arr = -1;
				for (var i = 0; i < arr_hijos.length; i++) {
					if (arr_hijos[i] == indice) {
						indice_arr = i;
						break;
					}
				}
				
				//Se busca en el texto el primer antecedente hijo posterior
				var pos_post_aux = -1;
				for (var i = indice_arr + 1; i < arr_hijos.length; i++) {
					var txt_busq_post = "<p>&nbsp;&nbsp;&nbsp;&nbsp;" + remplazar_acentos($("#hdd_nombre_ant_med_" + arr_hijos[i]).val(), "H") + ":";
					if (pos_padre_post_aux >= 0) {
						pos_post_aux = txt_base.substring(0, pos_padre_post_aux).indexOf(txt_busq_post, pos_padre_aux);
					} else {
						pos_post_aux = txt_base.indexOf(txt_busq_post, pos_padre_aux);
					}
					if (pos_post_aux >= 0) {
						break;
					}
				}
				
				//Si no se halla un antecedente hijo posterior, se busca la posición al final de los hijos
				if (pos_post_aux == -1) {
					if (pos_padre_post_aux == -1) {
						pos_post_aux = txt_base.length;
					} else {
						var txt_aux = "<p>&nbsp;</p>";
						pos_post_aux = pos_padre_post_aux - txt_aux.length;
						if (txt_base.substr(pos_post_aux, 1) != "<") {
							//Corrección por saltos de línea en el editor
							pos_post_aux -= 2;
						}
					}
				}
				
				//Se inserta el texto del hijo en la posición detectada
				var txt_post = txt_base.substring(pos_post_aux);
				txt_base = txt_base.substring(0, pos_post_aux) + txt_busq + "&nbsp;</p>" + txt_post;
			}
			
			CKEDITOR.instances.txt_desc_antecedentes_medicos.setData(txt_base);
		}
	} else if (pos_aux != -1) {
		if (indice_padre == "") {
			//Padres
			//Se buscan los checks de los hijos para desmarcarlos
			var arr_hijos = $("#hdd_ant_med_hijos_" + indice).val().split(",");
			for (var i = 0; i < arr_hijos.length; i++) {
				$("#chk_ant_med_" + arr_hijos[i]).prop("checked", false);
			}
			
			var pos_aux2 = txt_base.indexOf("<p><strong>", pos_aux + 5);
			if (pos_aux2 != -1) {
				txt_base = txt_base.substring(0, pos_aux) + txt_base.substring(pos_aux2);
			} else {
				txt_base = txt_base.substring(0, pos_aux);
			}
		} else {
			//Hijos
			var pos_padre_post_aux = obtener_posicion_siguiente_antecedente_padre(indice_padre, txt_base);
			
			var pos_aux2 = -1;
			if (pos_padre_post_aux >= 0) {
				pos_aux2 = txt_base.substring(0, pos_padre_post_aux).indexOf("<p>&nbsp;&nbsp;&nbsp;&nbsp;", pos_aux + 5);
			} else {
				pos_aux2 = txt_base.indexOf("<p>&nbsp;&nbsp;&nbsp;&nbsp;", pos_aux + 5);
			}
			
			if (pos_aux2 != -1) {
				txt_base = txt_base.substring(0, pos_aux) + txt_base.substring(pos_aux2);
			} else {
				//Se busca el siguiente padre
				pos_aux2 = txt_base.indexOf("<p>&nbsp;</p>", pos_aux + 5);
				if (pos_aux2 != -1) {
					txt_base = txt_base.substring(0, pos_aux) + txt_base.substring(pos_aux2);
				} else {
					txt_base = txt_base.substring(0, pos_aux);
				}
			}
		}
		
		CKEDITOR.instances.txt_desc_antecedentes_medicos.setData(txt_base);
	}
	
	ver_contactos_antecedentes_med();
}

function insertar_antecedente_padre(indice, txt_base) {
	var arr_padres = $("#hdd_ant_med_padres").val().split(",");
	var txt_insertar = "<p><strong>" + remplazar_acentos($("#hdd_nombre_ant_med_" + indice).val(), "H") + ":</strong>&nbsp;</p>";
	
	//Se busca la prosición del antecedente en el arreglo
	var indice_arr = -1;
	for (var i = 0; i < arr_padres.length; i++) {
		if (arr_padres[i] == indice) {
			indice_arr = i;
			break;
		}
	}
	
	//Se busca en el texto el primer antecedente padre posterior
	var pos_post_aux = -1;
	for (var i = indice_arr + 1; i < arr_padres.length; i++) {
		var txt_busq_post = "<p><strong>" + remplazar_acentos($("#hdd_nombre_ant_med_" + arr_padres[i]).val(), "H") + ":";
		pos_post_aux = txt_base.indexOf(txt_busq_post);
		if (pos_post_aux >= 0) {
			break;
		}
	}
	
	if (pos_post_aux >= 0) {
		//Se encontró un posterior, se ubica en esa posición
		var txt_post = txt_base.substring(pos_post_aux);
		txt_base = txt_base.substring(0, pos_post_aux) + txt_insertar + "<p>&nbsp;</p>" + txt_post;
	} else {
		if (txt_base != "") {
			var pos_aux2 = txt_base.lastIndexOf("<p>&nbsp;</p>");
			if ((pos_aux2 != -1 && (txt_base.length - pos_aux2) > 14) || pos_aux2 == -1) {
				txt_base += "<p>&nbsp;</p>";
			}
		}
		txt_base += txt_insertar;
	}
	
	return txt_base;
}

function obtener_posicion_siguiente_antecedente_padre(indice, txt_base) {
	var arr_padres = $("#hdd_ant_med_padres").val().split(",");
	
	//Se busca la prosición del padre en el arreglo
	var indice_arr = -1;
	for (var i = 0; i < arr_padres.length; i++) {
		if (arr_padres[i] == indice) {
			indice_arr = i;
			break;
		}
	}
	
	//Se busca en el texto la posición del primer antecedente padre posterior
	var pos_post_aux = -1;
	for (var i = indice_arr + 1; i < arr_padres.length; i++) {
		var txt_busq_post = "<p><strong>" + remplazar_acentos($("#hdd_nombre_ant_med_" + arr_padres[i]).val(), "H") + ":";
		pos_post_aux = txt_base.indexOf(txt_busq_post);
		if (pos_post_aux >= 0) {
			break;
		}
	}
	
	return pos_post_aux;
}

function ver_contactos_antecedentes_med() {
	var cant_antecedentes = parseInt($("#hdd_cant_antecedentes").val(), 10);
	var cont_aux = 0;
	var params = "opcion=1";
	for (var i = 0; i < cant_antecedentes; i++) {
		if ($("#chk_ant_med_" + i).is(":checked")) {
			params += "&id_antecedente_med_" + cont_aux + "=" + $("#hdd_ant_med_" + i).val();
			cont_aux++;
		}
	}
	
	if (cont_aux > 0) {
		params += "&cant_antecedentes=" + cont_aux;
		
		$("#d_interno_contactos_antecedentes").html("(Sin contactos)");
		llamarAjax("antecedentes_ajax.php", params, "d_interno_contactos_antecedentes", "continuar_ver_contactos_antecedentes_med();");
	} else {
		$("#d_interno_contactos_antecedentes").html("(Sin contactos)");
		$("#d_contactos_antecedentes").hide(200);
	}
}

function continuar_ver_contactos_antecedentes_med() {
	var cant_contactos_antecedentes_med = parseInt($("#hdd_cant_contactos_antecedentes_med").val(), 10);
	
	if (cant_contactos_antecedentes_med > 0) {
		$("#d_contactos_antecedentes").show(200);
	} else {
		$("#d_interno_contactos_antecedentes").html("(Sin contactos)");
		$("#d_contactos_antecedentes").hide(200);
	}
}

function abrir_cerrar_contactos_antecedentes_med() {
	if ($("#d_contactos_antecedentes").is(":visible")) {
	$("#d_contactos_antecedentes").hide(200);
	} else {
		$("#d_contactos_antecedentes").show(200);
	}
}

function extender_antecedente_medico(indice, indice_ext) {
	if ($("#chk_ant_med_" + indice).is(":checked")) {
		$("#tr_antec_extension_" + indice_ext).css("display", "table-row");
		
		var cant_antec_extension = parseInt($("#hdd_cant_antec_extension_" + indice_ext).val(), 10);
		if (cant_antec_extension == 0) {
			agregar_antec_extension(indice_ext);
		}
	} else {
		$("#tr_antec_extension_" + indice_ext).css("display", "none");
		$("#hdd_cant_antec_extension_" + indice_ext).val(0);
		$("#d_content_antec_extension_" + indice_ext).empty();
	}
}

function agregar_antec_extension(indice) {
	var cant_antec_extension = parseInt($("#hdd_cant_antec_extension_" + indice).val(), 10);
	
	jQuery("<div/>", {
		id: "d_det_antec_extension_" + indice + "_" + cant_antec_extension
	}).appendTo("#d_content_antec_extension_" + indice);
	
	var params = "opcion=2&indice=" + indice + "_" + cant_antec_extension +
				 "&tipo_extension=" + $("#hdd_tipo_antec_extension_" + indice).val();
	
	llamarAjax("antecedentes_ajax.php", params, "d_det_antec_extension_" + indice + "_" + cant_antec_extension, "");
	
	cant_antec_extension++;
	$("#hdd_cant_antec_extension_" + indice).val(cant_antec_extension);
}

function quitar_antec_extension(indice) {
	var cant_antec_extension = parseInt($("#hdd_cant_antec_extension_" + indice).val(), 10);
	if (cant_antec_extension > 0) {
		cant_antec_extension--;
		
		$("#d_det_antec_extension_" + indice + "_" + cant_antec_extension).remove();
		
		$("#hdd_cant_antec_extension_" + indice).val(cant_antec_extension);
	}
}

function validar_antec_extension() {
	var resultado = true;
	
	var cant_antec_extensiones = parseInt($("#hdd_cant_antec_extensiones").val(), 10);
	for (var i = 0; i < cant_antec_extensiones; i++) {
		var tipo_antec_extension = $("#hdd_tipo_antec_extension_" + i).val();
		var cant_det = parseInt($("#hdd_cant_antec_extension_" + i).val(), 10);
		
		switch (tipo_antec_extension) {
			case "1":
				for (var j = 0; j < cant_det; j++) {
					if (trim($("#txt_nombre_tipo_antec_med_" + i + "_" + j).val()) != "" || trim($("#txt_nombre_profesional_antec_med_" + i + "_" + j).val()) != ""
							|| $("#txt_fecha_det_antec_med_" + i + "_" + j).val() != "") {
						$("#txt_nombre_tipo_antec_med_" + i + "_" + j).removeClass("bordeAdmision");
						if (trim($("#txt_nombre_tipo_antec_med_" + i + "_" + j).val()) == "") {
							$("#txt_nombre_tipo_antec_med_" + i + "_" + j).addClass("bordeAdmision");
							resultado = false;
						}
						$("#txt_nombre_profesional_antec_med_" + i + "_" + j).removeClass("bordeAdmision");
						if (trim($("#txt_nombre_profesional_antec_med_" + i + "_" + j).val()) == "") {
							$("#txt_nombre_profesional_antec_med_" + i + "_" + j).addClass("bordeAdmision");
							resultado = false;
						}
					}
				}
				break;
		}
	}
	
	return resultado;
}

function obtener_parametros_antec_extension() {
	var cant_antec_extensiones = parseInt($("#hdd_cant_antec_extensiones").val(), 10);
	var params = "&cant_antec_extensiones=" + cant_antec_extensiones;
	
	for (i = 0; i < cant_antec_extensiones; i++) {
		var id_antec_extension = $("#hdd_id_antec_extension_" + i).val();
		var tipo_antec_extension = $("#hdd_tipo_antec_extension_" + i).val();
		var cant_det = parseInt($("#hdd_cant_antec_extension_" + i).val(), 10);
		
		params += "&id_antec_extension_" + i + "=" + id_antec_extension;
		
		var cont_aux = 0;
		switch (tipo_antec_extension) {
			case "1":
				for (var j = 0; j < cant_det; j++) {
					if (trim($("#txt_nombre_tipo_antec_med_" + i + "_" + j).val()) != "" || trim($("#txt_nombre_profesional_antec_med_" + i + "_" + j).val()) != "") {
						params += "&nombre_tipo_antec_med_" + i + "_" + cont_aux + "=" + str_encode($("#txt_nombre_tipo_antec_med_" + i + "_" + j).val()) +
								  "&nombre_profesional_antec_med_" + i + "_" + cont_aux + "=" + str_encode($("#txt_nombre_profesional_antec_med_" + i + "_" + j).val()) +
								  "&fecha_det_antec_med_" + i + "_" + cont_aux + "=" + $("#txt_fecha_det_antec_med_" + i + "_" + j).val();
						
						cont_aux++;
					}
				}
				break;
		}
		params += "&cant_antec_extension_" + i + "=" + cont_aux;
	}
	
	return params;
}
