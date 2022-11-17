/***********************************************/
/*Configuración del editor de texto enriquecido*/
/***********************************************/

if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
	CKEDITOR.tools.enableHtml5Elements(document);
}

CKEDITOR.config.height = 95;
CKEDITOR.config.width = 'auto';

var initCKEditorEvolucion = (function() {
	var wysiwygareaAvailable = isWysiwygareaAvailable(),
		isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');
	
	return function() {
		var editorElement = CKEDITOR.document.getById('txt_evolucion');
		
		//Dependiendo de la disponibilidad del plugin wysiwygare se incia el editor clásico o el editor en línea.
		if (wysiwygareaAvailable) {
			CKEDITOR.replace('txt_evolucion');
		} else {
			editorElement.setAttribute('contenteditable', 'true');
			CKEDITOR.inline('txt_evolucion');
		}
	};
	
	function isWysiwygareaAvailable() {
		if (CKEDITOR.revision == ('%RE' + 'V%')) {
			return true;
		}
		
		return !!CKEDITOR.plugins.get('wysiwygarea');
	}
} )();

var initCKEditorDiagEvol = (function() {
	var wysiwygareaAvailable = isWysiwygareaAvailable(),
		isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');
	
	return function() {
		var editorElement = CKEDITOR.document.getById('txt_diagnostico_evolucion');
		
		//Dependiendo de la disponibilidad del plugin wysiwygare se incia el editor clásico o el editor en línea.
		if (wysiwygareaAvailable) {
			CKEDITOR.replace('txt_diagnostico_evolucion');
		} else {
			editorElement.setAttribute('contenteditable', 'true');
			CKEDITOR.inline('txt_diagnostico_evolucion');
		}
	};
	
	function isWysiwygareaAvailable() {
		if (CKEDITOR.revision == ('%RE' + 'V%')) {
			return true;
		}
		
		return !!CKEDITOR.plugins.get('wysiwygarea');
	}
} )();

var initCKEditorSoliExa = (function() {
	var wysiwygareaAvailable = isWysiwygareaAvailable(),
		isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');
	
	return function() {
		var editorElement = CKEDITOR.document.getById('txt_solicitud_examenes_evolucion');
		
		//Dependiendo de la disponibilidad del plugin wysiwygare se incia el editor clásico o el editor en línea.
		if (wysiwygareaAvailable) {
			CKEDITOR.replace('txt_solicitud_examenes_evolucion');
		} else {
			editorElement.setAttribute('contenteditable', 'true');
			CKEDITOR.inline('txt_solicitud_examenes_evolucion');
		}
	};
	
	function isWysiwygareaAvailable() {
		if (CKEDITOR.revision == ('%RE' + 'V%')) {
			return true;
		}
		
		return !!CKEDITOR.plugins.get('wysiwygarea');
	}
} )();

var initCKEditorTratEvol = (function() {
	var wysiwygareaAvailable = isWysiwygareaAvailable(),
		isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');
	
	return function() {
		var editorElement = CKEDITOR.document.getById('txt_tratamiento_evolucion');
		
		//Dependiendo de la disponibilidad del plugin wysiwygare se incia el editor clásico o el editor en línea.
		if (wysiwygareaAvailable) {
			CKEDITOR.replace('txt_tratamiento_evolucion');
		} else {
			editorElement.setAttribute('contenteditable', 'true');
			CKEDITOR.inline('txt_tratamiento_evolucion');
		}
	};
	
	function isWysiwygareaAvailable() {
		if (CKEDITOR.revision == ('%RE' + 'V%')) {
			return true;
		}
		
		return !!CKEDITOR.plugins.get('wysiwygarea');
	}
} )();

/***********************************************/
/***********************************************/
/***********************************************/

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
	if (text == '') {
		ind_existe = 1;//Si Existe
	}
	if (ind_existe == 0) {
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
			$("#btn_imprimir").attr("disabled", "disabled");
			$("#btn_crear").attr("disabled", "disabled");
			$("#btn_finalizar").attr("disabled", "disabled");
			
			$("#contenedor_error").css("display", "none");
			if (validar_evolucion()) {
				editar_consulta_evolucion(tipo, ind_imprimir);
			} else {
				$("#contenedor_error").css("display", "block");
				$('#contenedor_error').html('Los campos marcados en rojo son obligatorios');
				window.scroll(0, 0);
				$("#btn_imprimir").removeAttr("disabled");
				$("#btn_crear").removeAttr("disabled");
				$("#btn_finalizar").removeAttr("disabled");
			}
			break;
		case 2: //Guardar cambios
			editar_consulta_evolucion(tipo, ind_imprimir);
			break;
	}
}

function imprimir_evolucion() {
	var params = "id_hc=" + $("#hdd_id_hc_consulta").val();
	
	llamarAjax("../historia_clinica/impresion_historia_clinica.php", params, "d_impresion_hc", "continuar_imprimir_evolucion()");
}

function continuar_imprimir_evolucion() {
	var ruta = $("#hdd_ruta_arch_hc_pdf").val();
	window.open("../funciones/abrir_pdf.php?ruta=" + ruta + "&nombre_arch=consulta_evolucion.pdf", "_blank");
}

function validar_evolucion() {
	var resultado = true;
	
    $("#cke_txt_evolucion").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#txt_nombre_usuario_alt").css({"border": "1px solid rgba(0,0,0,.2)"});
	for (var i = 1; i <= 10; i++) {
		$("#ciex_diagnostico_" + i).css({"border": "1px solid rgba(0,0,0,.2)"});
		$("#valor_ojos_" + i).css({"border": "1px solid rgba(0,0,0,.2)"});
	}
	
	var num_diag_oblig = parseInt($("#hdd_num_diag_oblig").val(), 10);
	for (var i = 1; i <= num_diag_oblig; i++) {
		if ($('#hdd_ciex_diagnostico_' + i).val() == '') {
			$("#ciex_diagnostico_" + i).css({"border": "2px solid #FF002A"});
			resultado = false;
		}
		if ($('#valor_ojos_' + i).val() == '') {
			$("#valor_ojos_" + i).css({"border": "2px solid #FF002A"});
			resultado = false;
		}
	}
	
	var cant_ciex = $('#lista_tabla').val()
	for (i = 1; i <= cant_ciex; i++) {
		var cod_ciex = $("#hdd_ciex_diagnostico_" + i).val();
		var val_ojos = $("#valor_ojos_" + i).val();
		if (cod_ciex != '' && val_ojos == '') {
			$("#valor_ojos_" + i).css({"border": "2px solid #FF002A"});
		 	resultado = false;
		}
	}
    if (CKEDITOR.instances.txt_evolucion.getData() == '') {
    //if ($('#txt_evolucion').val() == '') {
		$("#cke_txt_evolucion").css({"border": "2px solid #FF002A"});
		resultado = false;
	}
	
	if ($('#hdd_usuario_anonimo').val() == "1" && $("#txt_nombre_usuario_alt").val() == ""){
		$("#txt_nombre_usuario_alt").css({"border": "2px solid #FF002A"});
		result = false;
	}
	
	return resultado;
}

/**
 *tipo:
 * 1=Guardar y cambiar de estado la consulta
 * 2=Guardar y NO cambiar el estado de la consulta 
 */
function editar_consulta_evolucion(tipo, ind_imprimir) {
	$("#btn_imprimir").attr("disabled", "disabled");
	$("#btn_crear").attr("disabled", "disabled");
	$("#btn_finalizar").attr("disabled", "disabled");
	
	var id_hc = $('#hdd_id_hc_consulta').val();
	var id_admision = $('#hdd_id_admision').val();
	var texto_evolucion = str_encode(CKEDITOR.instances.txt_evolucion.getData());
	var diagnostico_evolucion = str_encode(CKEDITOR.instances.txt_diagnostico_evolucion.getData());
	var solicitud_examenes_evolucion = str_encode(CKEDITOR.instances.txt_solicitud_examenes_evolucion.getData());
	var tratamiento_evolucion = str_encode(CKEDITOR.instances.txt_tratamiento_evolucion.getData());
	var medicamentos_evolucion = str_encode($('#medicamentos_evolucion').val());
	var nombre_usuario_alt = str_encode($('#txt_nombre_usuario_alt').val());
	
	var params = 'opcion=1&id_hc=' + id_hc +
				 '&id_admision=' + id_admision +
	             '&texto_evolucion=' + texto_evolucion +
				 '&tipo_guardar=' + tipo +
				 '&diagnostico_evolucion=' +diagnostico_evolucion +
				 '&solicitud_examenes_evolucion=' + solicitud_examenes_evolucion +
				 '&tratamiento_evolucion=' + tratamiento_evolucion +
				 '&medicamentos_evolucion=' + medicamentos_evolucion +
				 '&nombre_usuario_alt=' + nombre_usuario_alt;
	
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
	
	llamarAjax("evolucion_ajax.php", params, "d_guardar_evolucion", "validar_exito(" + ind_imprimir + ")");
}

function validar_exito(ind_imprimir) {
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
			
			if (ind_imprimir == 1) {
				imprimir_evolucion();
			}
		} else {
			$("#contenedor_error").css("display", "block");
			$('#contenedor_error').html('Error al guardar la evoluci&oacute;n');
		}
	} else if (hdd_tipo_guardar == 3) { //Permanece en el formulario
		if (hdd_exito > 0) {
			$("#contenedor_exito").css("display", "block");
			$('#contenedor_exito').html('Datos guardados correctamente');
			setTimeout('$("#contenedor_exito").css("display", "none")', 3000);
			
			if (ind_imprimir == 1) {
				imprimir_evolucion();
			}
		} else {
			$("#contenedor_error").css("display", "block");
			$('#contenedor_error').html('Error al guardar la evoluci&oacute;n');
		}
	}
	window.scrollTo(0, 0);
	$("#btn_imprimir").removeAttr("disabled");
	$("#btn_crear").removeAttr("disabled");
	$("#btn_finalizar").removeAttr("disabled");
}

function enviar_a_estados() {
	guardar_evolucion(2, 0);
	
	var params = "opcion=2&id_hc=" + $("#hdd_id_hc_consulta").val() +
				 "&id_admision=" + $("#hdd_id_admision").val();
	
	llamarAjax("evolucion_ajax.php", params, "d_interno", "mostrar_formulario_flotante(1);");
}
