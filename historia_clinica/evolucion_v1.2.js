function mostrar_formulario_flotante(tipo){
	if(tipo==1){//mostrar
		$('#fondo_negro').css('display', 'block');
		$('#d_centro').slideDown(400).css('display', 'block');
	}
	else if(tipo==0){//Ocultar
		$('#fondo_negro').css('display', 'none');
		$('#d_centro').slideDown(400).css('display', 'none');
	}
}

function reducir_formulario_flotante(ancho, alto){ //480, 390
	$('.div_centro').width(ancho);
	$('.div_centro').height(alto);
	$('.div_centro').css('top', '20%');
	$('.div_interno').width(ancho-15);
	$('.div_interno').height(alto-35);
}

function validar_array(array, id){
	var text = $(id).val();
	var ind_existe = 0;//No existe
	for(var i=0;i<array.length;i++){
		if(text == array[i]){
			ind_existe = 1;//Si Existe
			break;  
		}
	}
	if(text == ''){
		ind_existe = 1;//Si Existe
	}
	if(ind_existe == 0){
		alert('Valor incorrecto');
		document.getElementById(id.id).value="";
		input = id.id;
		setTimeout('document.getElementById(input).focus()',75); 
	}
}

function mostrar_formulario(tipo) {
    if (tipo == 1) {//mostrar
        $('.formulario').slideDown(600).css('display', 'block')
    }
    else if (tipo == 0) {//Ocultar
        $('.formulario').slideUp(600).css('display', 'none')
    }
}

/**
 *tipo:
 * 1=Guardar y cambiar de estado la consulta
 * 2=Guardar y NO cambiar el estado de la consulta SIN VALIDAR LOS CAMPOS
 */
function guardar_evolucion(tipo, ind_imprimir) {
	switch (tipo) {
		case 1: //Finalizar consulta
		case 3: //Guardar desde la historia
		case 4: //Finalizar consulta desde traslado
			$("#contenedor_error").css("display", "none");
			if (validar_evolucion()) {
				editar_consulta_evolucion(tipo);
			} else {
				$("#contenedor_error").css("display", "block");
				$('#contenedor_error').html('Los campos marcados en rojo son obligatorios');
				window.scroll(0, 0);
			}
			break;
		case 2: //Guardar cambios
			editar_consulta_evolucion(tipo);
			break;
	}
	
	if (ind_imprimir == 1) {
		setTimeout("imprimir_evolucion()", 1000);
	}
}

function imprimir_evolucion() {
	var params = "id_hc=" + $("#hdd_id_hc_consulta").val();
	
	llamarAjax("../historia_clinica/impresion_historia_clinica.php", params, "d_impresion_hc", "imprSelec(\"d_impresion_hc\")");
}

function validar_evolucion() {
	var resultado = true;
	var panel_1 = 0;
	var panel_2 = 0;
	
	$("#panel_evolu_1").removeClass("borde_error_panel");
	$("#panel_evolu_1 a").css({"color": "#5B5B5B"});
	$("#panel_evolu_2").removeClass("borde_error_panel");
	$("#panel_evolu_2 a").css({"color": "#5B5B5B"});
	
	
    $("#txt_evolucion").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#ciex_diagnostico_1").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#valor_ojos_1").css({"border": "1px solid rgba(0,0,0,.2)"});
	var cant_ciex = $('#lista_tabla').val()
	for (i = 1; i <= cant_ciex; i++) {
	 	 $("#valor_ojos_" + i).css({"border": "1px solid rgba(0,0,0,.2)"});
	}
	
	if ($('#hdd_ciex_diagnostico_1').val() == '') {
		$("#ciex_diagnostico_1").css({"border": "2px solid #FF002A"});
		resultado = false;
		panel_2=1;
	}
	if ($('#valor_ojos_1').val() == '') {
		$("#valor_ojos_1").css({"border": "2px solid #FF002A"});
		resultado = false;
		panel_2=1;
	}
	for (i = 1; i <= cant_ciex; i++) {
		var cod_ciex = $("#hdd_ciex_diagnostico_"+i).val();
		var val_ojos = $("#valor_ojos_"+i).val();
		if (cod_ciex != '' && val_ojos == '') {
			$("#valor_ojos_" + i).css({"border": "2px solid #FF002A"});
		 	resultado = false;
		 	panel_2=1;
		}
	}
    if($('#txt_evolucion').val()==''){
		$("#txt_evolucion").css({"border": "2px solid #FF002A"});
		resultado = false;
		panel_1=1;
	}
	
	if(panel_1 == 1){
	   $("#panel_evolu_1").addClass("borde_error_panel");
	   $("#panel_evolu_1 a").css({"color": "#FF002A"});
	}
	if(panel_2 == 1){
	   $("#panel_evolu_2").addClass("borde_error_panel");
	   $("#panel_evolu_2 a").css({"color": "#FF002A"});
	}
	
	return resultado;
}

/**
 *tipo:
 * 1=Guardar y cambiar de estado la consulta
 * 2=Guardar y NO cambiar el estado de la consulta 
 */
function editar_consulta_evolucion(tipo){
	var id_hc = $('#hdd_id_hc_consulta').val();
	var id_admision = $('#hdd_id_admision').val();
	var texto_evolucion = str_encode($('#txt_evolucion').val());
	var diagnostico_evolucion  = str_encode($('#diagnostico_evolucion').val()); 
	var solicitud_examenes_evolucion = str_encode($('#solicitud_examenes_evolucion').val());
	var tratamiento_evolucion = str_encode($('#tratamiento_evolucion').val());
	var medicamentos_evolucion = str_encode($('#medicamentos_evolucion').val());
	
	
	var params = 'opcion=1&id_hc=' + id_hc +
				 '&id_admision=' + id_admision +
	             '&texto_evolucion=' + texto_evolucion +
				 '&tipo_guardar=' + tipo +
				 '&diagnostico_evolucion=' +diagnostico_evolucion +
				 '&solicitud_examenes_evolucion=' + solicitud_examenes_evolucion +
				 '&tratamiento_evolucion=' + tratamiento_evolucion +
				 '&medicamentos_evolucion=' + medicamentos_evolucion;
	
	//Para Diagnosticos
	var cant_ciex = $('#lista_tabla').val()
	params += '&cant_ciex=' + cant_ciex;
	for (i = 1; i <= cant_ciex; i++) {
		var cod_ciex = $("#hdd_ciex_diagnostico_" + i).val();
		var val_ojos = $("#valor_ojos_" + i).val();
		if (cod_ciex != '') {
			params += '&cod_ciex_' + i + '=' + cod_ciex +
					  '&val_ojos_' + i + '=' + val_ojos;
		}
	}
	
	llamarAjax("evolucion_ajax.php", params, "d_guardar_evolucion", "validar_exito()");
}

function validar_exito() {
	var hdd_exito = $('#hdd_exito').val();
	var hdd_url_menu = $('#hdd_url_menu').val();
	var hdd_tipo_guardar = $('#hdd_tipo_guardar').val();
	
	if (hdd_tipo_guardar == 1) { //Cierra el formulario
		if (hdd_exito > 0) {
			$('#frm_consulta_evolucion').css('display', 'none');
			$("#contenedor_exito").css("display", "block");
			$('#contenedor_exito').html('Datos guardados correctamente');
			setTimeout("enviar_credencial('" + hdd_url_menu + "')", 3000);
		} else {
			$("#contenedor_error").css("display", "block");
			$('#contenedor_error').html('Error al guardar la evoluci&oacute;n');
		}
	} else if (hdd_tipo_guardar == 2) { //Permanece en el formulario
		if (hdd_exito > 0) {
			$("#contenedor_exito").css("display", "block");
			$('#contenedor_exito').html('Datos guardados correctamente');
			setTimeout('$("#contenedor_exito").css("display", "none")', 3000);
		} else {
			$("#contenedor_error").css("display", "block");
			$('#contenedor_error').html('Error al guardar la evoluci&oacute;n');
		}
	} else if (hdd_tipo_guardar == 3) { //Permanece en el formulario
		if (hdd_exito > 0) {
			$("#contenedor_exito").css("display", "block");
			$('#contenedor_exito').html('Datos guardados correctamente');
			setTimeout('$("#contenedor_exito").css("display", "none")', 3000);
		} else {
			$("#contenedor_error").css("display", "block");
			$('#contenedor_error').html('Error al guardar la evoluci&oacute;n');
		}
	}
	window.scrollTo(0, 0);
}

function enviar_a_estados() {
	guardar_evolucion(2, 0);
	
	var params = "opcion=2&id_hc=" + $("#hdd_id_hc_consulta").val() +
				 "&id_admision=" + $("#hdd_id_admision").val();
	
	llamarAjax("evolucion_ajax.php", params, "d_interno", "mostrar_formulario_flotante(1);");
}
