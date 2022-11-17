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
