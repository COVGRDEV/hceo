/***********************************************/
/*Configuración del editor de texto enriquecido*/
/***********************************************/

if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
	CKEDITOR.tools.enableHtml5Elements(document);
}

CKEDITOR.config.height = 70;
CKEDITOR.config.width = 'auto';

var initCKEditorOptom = (function(id_obj) {
	var wysiwygareaAvailable = isWysiwygareaAvailable(),
		isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');
	
	return function(id_obj) {
		var editorElement = CKEDITOR.document.getById(id_obj);
		
		//Dependiendo de la disponibilidad del plugin wysiwygare se incia el editor clásico o el editor en línea.
		if (wysiwygareaAvailable) {
			CKEDITOR.replace(id_obj);
		} else {
			editorElement.setAttribute('contenteditable', 'true');
			CKEDITOR.inline(id_obj);
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

var arr_textarea_ids = [];
function ajustar_textareas() {
	for (i = 0; i < arr_textarea_ids.length; i++) {
		$("#" + arr_textarea_ids[i]).trigger("input");
	}
}

var g_querato_np = "NP/NA";

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


function mostrar_div(id_div){
	$('#'+id_div).css('display', 'block');
} 


function reducir_formulario_flotante(ancho, alto){ //480, 390
	
	$('.div_centro').width(ancho);
	$('.div_centro').height(alto);
	$('.div_centro').css('top', '20%');
	$('.div_interno').width(ancho-15);
	$('.div_interno').height(alto-35);
	
}
function cambiar_mas(text){
	var resultado = text.replace("+","|mas");
	return resultado; 
}


function calcular_diferencia(val1, val2, eje1, eje2, resul) {
	
	if ($('#' + val1).val() == g_querato_np) {
		$('#' + eje1).val('');
		$('#' + eje1).attr("disabled", "disabled");
		$('#' + resul).val(g_querato_np);
	}
	else if ($('#' + val2).val() == g_querato_np) {
		$('#' + eje2).val('');
		$('#' + eje2).attr("disabled", "disabled");
		$('#' + resul).val(g_querato_np);
	}
	else{		
		$('#' + eje1).removeAttr('disabled');
		$('#' + eje2).removeAttr('disabled');
		
		var numero1 = $('#' + val1).val().replace(',', ".");
		var numero2 = $('#' + val2).val().replace(',', ".");
		var valor1 = parseFloat(numero1);
		var valor2 = parseFloat(numero2);
		if($('#' + val1).val() != '' && $('#' + val2).val() != ''){
			var resultado = valor1 - valor2;
			var num_resul = parseFloat(resultado);
			if (!isNaN(num_resul)) {
				$('#' + resul).val(num_resul);
				var text_resul = $('#' + resul).val();
				text_resul = text_resul.replace('.', ",");
				$('#' + resul).val(text_resul);
			}
		}
		
		if ($('#' + val1).val() == '' || $('#' + val2).val() == '') {
			$('#' + resul).val('');
		}
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

function llamar_crear_usuarios() {
    var params = 'opcion=1';
    llamarAjax("consulta_optometria_ajax.php", params, "principal_optometria", "mostrar_formulario(1)");
}


/**
 * Validar los campos de optometria
 */
function validar_optometria() {
	var result = 0;
	
	$("#cke_txt_anamnesis").removeClass("borde_error");
	
	$("#avsc_lejos_od").removeClass("borde_error");
	$("#avsc_cerca_od").removeClass("borde_error");
	$("#avsc_lejos_oi").removeClass("borde_error");
	$("#avsc_cerca_oi").removeClass("borde_error");
	
	$("#querato_k1_od").removeClass("borde_error");
	$("#querato_ejek1_od").removeClass("borde_error");
	$("#querato_dif_od").removeClass("borde_error");
	$("#querato_k1_oi").removeClass("borde_error");
	$("#querato_ejek1_oi").removeClass("borde_error");
	$("#querato_dif_oi").removeClass("borde_error");
	
	$("#subjetivo_esfera_od").removeClass("borde_error");
	$("#subjetivo_lejos_od").removeClass("borde_error");
	$("#subjetivo_cerca_od").removeClass("borde_error");
	$("#subjetivo_esfera_oi").removeClass("borde_error");
	$("#subjetivo_lejos_oi").removeClass("borde_error");
	$("#subjetivo_cerca_oi").removeClass("borde_error");
	
	$("#refrafinal_esfera_od").removeClass("borde_error");
	$("#refrafinal_esfera_oi").removeClass("borde_error");
	
	$("#txt_nombre_usuario_alt").removeClass("borde_error");
	
	//Para diagnosticos pintar normal
	$("#ciex_diagnostico_1").removeClass("borde_error");
	$("#valor_ojos_1").removeClass("borde_error");
	var cant_ciex = $('#lista_tabla').val()
	for (i = 1; i <= cant_ciex; i++) {
	 	 var cod_ciex = $("#hdd_ciex_diagnostico_" + i).val();
	 	 var val_ojos = $("#valor_ojos_" + i).val();
	 	 $("#valor_ojos_" + i).removeClass("borde_error");
	}
	
	//Para diagnosticos pintar error
	if ($('#hdd_ciex_diagnostico_1').val() == '') {
		$("#ciex_diagnostico_1").addClass("borde_error");
		result = 1;
	}
	if ($('#valor_ojos_1').val() == '') {
		$("#valor_ojos_1").addClass("borde_error");
		result = 1;
	}
	var cant_ciex = $('#lista_tabla').val()
	for (i = 1; i <= cant_ciex; i++) {
	 	 var cod_ciex = $("#hdd_ciex_diagnostico_" + i).val();
	 	 var val_ojos = $("#valor_ojos_" + i).val();
	 	 if (cod_ciex != '' && val_ojos == '') {
	 	 	$("#valor_ojos_" + i).addClass("borde_error");
	 	 	result = 1;
	 	 }
	}
	
	if (CKEDITOR.instances.txt_anamnesis.getData() == "") {
	//if ($('#txt_anamnesis').val() == '') {
		$("#cke_txt_anamnesis").addClass("borde_error");
		result = 1;
	}
	
	if ($('#avsc_lejos_od').val() == '' && $('#avsc_lejos_od').attr("disabled") != "disabled") {
		$("#avsc_lejos_od").addClass("borde_error");
		result = 1;
	}
	if ($('#avsc_cerca_od').val() == '' && $('#avsc_cerca_od').attr("disabled") != "disabled") {
		$("#avsc_cerca_od").addClass("borde_error");
		result = 1;
	}
	if ($('#avsc_lejos_oi').val() == '' && $('#avsc_lejos_oi').attr("disabled") != "disabled") {
		$("#avsc_lejos_oi").addClass("borde_error");
		result = 1;
	}
	if ($('#avsc_cerca_oi').val() == '' && $('#avsc_cerca_oi').attr("disabled") != "disabled") {
		$("#avsc_cerca_oi").addClass("borde_error");
		result = 1;
	}
	
	if ($('#querato_k1_od').val() == '' && $('#querato_k1_od').attr("disabled") != "disabled") {
		$("#querato_k1_od").addClass("borde_error");
		result = 1;
	}
	if ($('#querato_ejek1_od').val() == '' && $('#querato_ejek1_od').attr("disabled") != "disabled" && $('#querato_k1_od').val() != g_querato_np) {
		$("#querato_ejek1_od").addClass("borde_error");
		result = 1;
	}
	if ($('#querato_dif_od').val() == '' && $('#querato_dif_od').attr("disabled") != "disabled") {
		$("#querato_dif_od").addClass("borde_error");
		result = 1;
	}
	if ($('#querato_k1_oi').val() == '' && $('#querato_k1_oi').attr("disabled") != "disabled") {
		$("#querato_k1_oi").addClass("borde_error");
		result = 1;
	}
	if ($('#querato_ejek1_oi').val() == '' && $('#querato_ejek1_oi').attr("disabled") != "disabled" && $('#querato_k1_oi').val() != g_querato_np) {
		$("#querato_ejek1_oi").addClass("borde_error");
		result = 1;
	}
	if ($('#querato_dif_oi').val() == '' && $('#querato_dif_oi').attr("disabled") != "disabled") {
		$("#querato_dif_oi").addClass("borde_error");
		result = 1;
	}
	
	if ($('#subjetivo_esfera_od').val() == '' && $('#subjetivo_esfera_od').attr("disabled") != "disabled") {
		$("#subjetivo_esfera_od").addClass("borde_error");
		result = 1;
	}
	if ($('#subjetivo_lejos_od').val() == '' && $('#subjetivo_lejos_od').attr("disabled") != "disabled") {
		$("#subjetivo_lejos_od").addClass("borde_error");
		result = 1;
	}
	if ($('#subjetivo_cerca_od').val() == '' && $('#subjetivo_cerca_od').attr("disabled") != "disabled") {
		$("#subjetivo_cerca_od").addClass("borde_error");
		result = 1;
	}
	if ($('#subjetivo_esfera_oi').val() == '' && $('#subjetivo_esfera_oi').attr("disabled") != "disabled") {
		$("#subjetivo_esfera_oi").addClass("borde_error");
		result = 1;
	}
	if ($('#subjetivo_lejos_oi').val() == '' && $('#subjetivo_lejos_oi').attr("disabled") != "disabled") {
		$("#subjetivo_lejos_oi").addClass("borde_error");
		result = 1;
	}
	if ($('#subjetivo_cerca_oi').val() == '' && $('#subjetivo_cerca_oi').attr("disabled") != "disabled") {
		$("#subjetivo_cerca_oi").addClass("borde_error");
		result = 1;
	}
	
	if ($('#refrafinal_esfera_od').val() == '' && $('#refrafinal_esfera_od').attr("disabled") != "disabled") {
		$("#refrafinal_esfera_od").addClass("borde_error");
		result = 1;
	}
	if ($('#refrafinal_esfera_oi').val() == '' && $('#refrafinal_esfera_oi').attr("disabled") != "disabled") {
		$("#refrafinal_esfera_oi").addClass("borde_error");
		result = 1;
	}
	
	if ($('#hdd_usuario_anonimo').val() == "1" && $("#txt_nombre_usuario_alt").val() == ""){
		$("#txt_nombre_usuario_alt").addClass("borde_error");
		result=1;
	}
	
	return result;
	
}

/**
 *tipo:
 * 1=Guardar y cambiar de estado la consulta
 * 2=Guardar y NO cambiar el estado de la consulta SIN VALIDAR LOS CAMPOS
 */
function validar_crear_optometria(tipo, ind_imprimir) {
	switch (tipo) {
		case 1: //Finalizar consulta
		case 3: //Guardar desde la historia
		case 4: //Finalizar consulta desde traslado
			$("#btn_imprimir").attr("disabled", "disabled");
			$("#btn_crear").attr("disabled", "disabled");
			$("#btn_finalizar").attr("disabled", "disabled");
			
			$("#contenedor_error").css("display", "none");
			var cmb_validar_consulta = $('#cmb_validar_consulta').val();
			if (cmb_validar_consulta == '1') {
				if (validar_optometria() == 0) {
					editar_consulta_optometria(tipo, ind_imprimir);
					return false;
				} else {
					$("#contenedor_error").css("display", "block");
					$('#contenedor_error').html('Los campos marcados en rojo son obligatorios');
					window.scroll(0, 0);
					$("#btn_imprimir").removeAttr("disabled");
					$("#btn_crear").removeAttr("disabled");
					$("#btn_finalizar").removeAttr("disabled");
					return false;
				}
			} else {
				editar_consulta_optometria(tipo, ind_imprimir);
			}
			break;
			
		case 2: //Guardar cambios
			editar_consulta_optometria(tipo, ind_imprimir);
			break;
	}
}

function imprimir_optometria() {
	var params = "id_hc=" + $("#hdd_id_hc_consulta").val();
	
	llamarAjax("../historia_clinica/impresion_historia_clinica.php", params, "d_impresion_hc", "continuar_imprimir_optometria();");
}

function continuar_imprimir_optometria() {
	var ruta = $("#hdd_ruta_arch_hc_pdf").val();
	window.open("../funciones/abrir_pdf.php?ruta=" + ruta + "&nombre_arch=consulta_optometria.pdf", "_blank");
}

/**
 *tipo:
 * 1=Guardar y cambiar de estado la consulta
 * 2=Guardar y NO cambiar el estado de la consulta 
 */
function editar_consulta_optometria(tipo, ind_imprimir) {
	$("#btn_imprimir").attr("disabled", "disabled");
	$("#btn_crear").attr("disabled", "disabled");
	$("#btn_finalizar").attr("disabled", "disabled");
	
	var hdd_id_hc_consulta = $('#hdd_id_hc_consulta').val();
	var hdd_id_admision = $('#hdd_id_admision').val();
	var txt_anamnesis = str_encode(CKEDITOR.instances.txt_anamnesis.getData());
	
	var avsc_lejos_od = $('#avsc_lejos_od').val();
	var avsc_cerca_od = $('#avsc_cerca_od').val();
	var avsc_lejos_oi = $('#avsc_lejos_oi').val();
	var avsc_cerca_oi = $('#avsc_cerca_oi').val();
	
	var lenso_esfera_od = cambiar_mas($('#lenso_esfera_od').val());
	var lenso_cilindro_od = $('#lenso_cilindro_od').val();
	var lenso_eje_od = $('#lenso_eje_od').val();
	var lenso_lejos_od = $('#lenso_lejos_od').val();
	var lenso_adicion_od = $('#lenso_adicion_od').val();
	var lenso_cerca_od = $('#lenso_cerca_od').val();
	var lenso_esfera_oi = cambiar_mas($('#lenso_esfera_oi').val());
	var lenso_cilindro_oi = $('#lenso_cilindro_oi').val();
	var lenso_eje_oi = $('#lenso_eje_oi').val();
	var lenso_lejos_oi = $('#lenso_lejos_oi').val();
	var lenso_adicion_oi = $('#lenso_adicion_oi').val();
	var lenso_cerca_oi = $('#lenso_cerca_oi').val();
	
	var querato_k1_od = $('#querato_k1_od').val();
	var querato_ejek1_od = $('#querato_ejek1_od').val();
	var querato_dif_od = $('#querato_dif_od').val();
	var querato_k1_oi = $('#querato_k1_oi').val();
	var querato_ejek1_oi = $('#querato_ejek1_oi').val();
	var querato_dif_oi = $('#querato_dif_oi').val();
	
	var refraobj_esfera_od = cambiar_mas($('#refraobj_esfera_od').val());
	var refraobj_cilindro_od = $('#refraobj_cilindro_od').val();
	var refraobj_eje_od = $('#refraobj_eje_od').val();
	var refraobj_lejos_od = $('#refraobj_lejos_od').val();
	var refraobj_esfera_oi = $('#refraobj_esfera_oi').val();
	var refraobj_cilindro_oi = $('#refraobj_cilindro_oi').val();
	var refraobj_eje_oi = $('#refraobj_eje_oi').val();
	var refraobj_lejos_oi = $('#refraobj_lejos_oi').val();
	
	var subjetivo_esfera_od = cambiar_mas($('#subjetivo_esfera_od').val());
	var subjetivo_cilindro_od = $('#subjetivo_cilindro_od').val();
	var subjetivo_eje_od = $('#subjetivo_eje_od').val();
	var subjetivo_lejos_od = $('#subjetivo_lejos_od').val();
	var subjetivo_ph_od = $('#subjetivo_ph_od').val();
	var subjetivo_adicion_od = $('#subjetivo_adicion_od').val();
	var subjetivo_cerca_od = $('#subjetivo_cerca_od').val();
	var subjetivo_esfera_oi = cambiar_mas($('#subjetivo_esfera_oi').val());
	var subjetivo_cilindro_oi = $('#subjetivo_cilindro_oi').val();
	var subjetivo_eje_oi = $('#subjetivo_eje_oi').val();
	var subjetivo_lejos_oi = $('#subjetivo_lejos_oi').val();
	var subjetivo_ph_oi = $('#subjetivo_ph_oi').val();
	var subjetivo_adicion_oi = $('#subjetivo_adicion_oi').val();
	var subjetivo_cerca_oi = $('#subjetivo_cerca_oi').val();
	
	var cicloplejio_esfera_od = cambiar_mas($('#cicloplejio_esfera_od').val());
	var cicloplejio_cilindro_od = $('#cicloplejio_cilindro_od').val();
	var cicloplejio_eje_od = $('#cicloplejio_eje_od').val();
	var cicloplejio_lejos_od = $('#cicloplejio_lejos_od').val();
	var cicloplejio_esfera_oi = cambiar_mas($('#cicloplejio_esfera_oi').val());
	var cicloplejio_cilindro_oi = $('#cicloplejio_cilindro_oi').val();
	var cicloplejio_eje_oi = $('#cicloplejio_eje_oi').val();
	var cicloplejio_lejos_oi = $('#cicloplejio_lejos_oi').val();
	
	var refrafinal_esfera_od = cambiar_mas($('#refrafinal_esfera_od').val());
	var refrafinal_cilindro_od = $('#refrafinal_cilindro_od').val();
	var refrafinal_eje_od = $('#refrafinal_eje_od').val();
	var refrafinal_adicion_od = $('#refrafinal_adicion_od').val();
	var refrafinal_esfera_oi = cambiar_mas($('#refrafinal_esfera_oi').val());
	var refrafinal_cilindro_oi = $('#refrafinal_cilindro_oi').val();
	var refrafinal_eje_oi = $('#refrafinal_eje_oi').val();
	var refrafinal_adicion_oi = $('#refrafinal_adicion_oi').val();
	
	var presion_intraocular_od = $('#presion_intraocular_od').val();
	var presion_intraocular_oi = $('#presion_intraocular_oi').val();
	
	var diagnostico_optometria = str_encode(CKEDITOR.instances.txt_diagnostico_optometria.getData());
	var txt_observaciones_subjetivo = str_encode(CKEDITOR.instances.txt_observaciones_subjetivo.getData());
	var txt_observaciones_rxfinal = str_encode(CKEDITOR.instances.txt_observaciones_rxfinal.getData());
	
	var cmb_validar_consulta = str_encode($('#cmb_validar_consulta').val());
	var cmb_grado_satisfaccion = str_encode($('#cmb_grado_satisfaccion').val());
	
	var nombre_usuario_alt = str_encode($('#txt_nombre_usuario_alt').val());
	
	if($("#rx_anteojos").is(':checked')) {var rx_anteojos = 1;} else {var rx_anteojos = 0;}  
	if($("#rx_lc").is(':checked')) {var rx_lc = 1;} else {var rx_lc = 0;}
	if($("#rx_refractiva").is(':checked')) {var rx_refractiva = 1;} else {var rx_refractiva = 0;}
	if($("#alternativa_anteojos").is(':checked')) {var alternativa_anteojos = 1;} else {var alternativa_anteojos = 0;}
	if($("#alternativa_lc").is(':checked')) {var alternativa_lc = 1;} else {var alternativa_lc = 0;}
	if($("#alternativa_refractiva").is(':checked')) {var alternativa_refractiva = 1;} else {var alternativa_refractiva = 0;}
	var alternativa_otra = str_encode($('#alternativa_otra').val());
	var cmb_paciente_dilatado = str_encode($('#cmb_paciente_dilatado').val());
	
	var observaciones_optometricas_finales = "";
	
	var cmb_dominancia_ocular = str_encode($('#cmb_dominancia_ocular').val());
	
	//Para Diagnosticos
	var cant_ciex = $('#lista_tabla').val()
	var params = 'opcion=1&cant_ciex=' + cant_ciex;
	for (i = 1; i <= cant_ciex; i++) {
	 	 var cod_ciex = $("#hdd_ciex_diagnostico_"+i).val();
	 	 var val_ojos = $("#valor_ojos_"+i).val();
	 	 if(cod_ciex!=''){
	 	 	params += '&cod_ciex_' + i + '=' + cod_ciex + '&val_ojos_' + i + '=' + val_ojos;
	 	 }
	}
	
	params += '&hdd_id_hc_consulta='+ hdd_id_hc_consulta +
			  '&hdd_id_admision=' + hdd_id_admision +
			  '&txt_anamnesis=' + txt_anamnesis +
			  '&avsc_lejos_od=' + avsc_lejos_od +
			  '&avsc_cerca_od=' + avsc_cerca_od +
			  '&avsc_lejos_oi=' + avsc_lejos_oi +
			  '&avsc_cerca_oi=' + avsc_cerca_oi +
			  '&lenso_esfera_od=' + lenso_esfera_od +
			  '&lenso_cilindro_od=' + lenso_cilindro_od +
			  '&lenso_eje_od=' + lenso_eje_od +
			  '&lenso_lejos_od=' + lenso_lejos_od +
			  '&lenso_adicion_od=' + lenso_adicion_od +
			  '&lenso_cerca_od=' + lenso_cerca_od +
			  '&lenso_esfera_oi=' + lenso_esfera_oi +
			  '&lenso_cilindro_oi=' + lenso_cilindro_oi +
			  '&lenso_eje_oi=' + lenso_eje_oi +
			  '&lenso_lejos_oi=' + lenso_lejos_oi +
			  '&lenso_adicion_oi=' + lenso_adicion_oi +
			  '&lenso_cerca_oi=' + lenso_cerca_oi +
			  '&querato_k1_od=' + querato_k1_od +
			  '&querato_ejek1_od=' + querato_ejek1_od +
			  '&querato_dif_od=' + querato_dif_od +
			  '&querato_k1_oi=' + querato_k1_oi +
			  '&querato_ejek1_oi=' + querato_ejek1_oi +
			  '&querato_dif_oi=' + querato_dif_oi +
			  '&refraobj_esfera_od=' + refraobj_esfera_od +
			  '&refraobj_cilindro_od=' + refraobj_cilindro_od +
			  '&refraobj_eje_od=' + refraobj_eje_od +
			  '&refraobj_lejos_od=' + refraobj_lejos_od +
			  '&refraobj_esfera_oi=' + refraobj_esfera_oi +
			  '&refraobj_cilindro_oi=' + refraobj_cilindro_oi +
			  '&refraobj_eje_oi=' + refraobj_eje_oi +
			  '&refraobj_lejos_oi=' + refraobj_lejos_oi +
			  '&subjetivo_esfera_od=' + subjetivo_esfera_od +
			  '&subjetivo_cilindro_od=' + subjetivo_cilindro_od +
			  '&subjetivo_eje_od=' + subjetivo_eje_od +
			  '&subjetivo_lejos_od=' + subjetivo_lejos_od +
			  '&subjetivo_ph_od=' + subjetivo_ph_od +
			  '&subjetivo_adicion_od=' + subjetivo_adicion_od +
			  '&subjetivo_cerca_od=' + subjetivo_cerca_od +
			  '&subjetivo_esfera_oi=' + subjetivo_esfera_oi +
			  '&subjetivo_cilindro_oi=' + subjetivo_cilindro_oi +
			  '&subjetivo_eje_oi=' + subjetivo_eje_oi +
			  '&subjetivo_lejos_oi=' + subjetivo_lejos_oi +
			  '&subjetivo_ph_oi=' + subjetivo_ph_oi +
			  '&subjetivo_adicion_oi=' + subjetivo_adicion_oi +
			  '&subjetivo_cerca_oi=' + subjetivo_cerca_oi +
			  '&cicloplejio_esfera_od=' + cicloplejio_esfera_od +
			  '&cicloplejio_cilindro_od=' + cicloplejio_cilindro_od +
			  '&cicloplejio_eje_od=' + cicloplejio_eje_od +
			  '&cicloplejio_lejos_od=' + cicloplejio_lejos_od +
			  '&cicloplejio_esfera_oi=' + cicloplejio_esfera_oi +
			  '&cicloplejio_cilindro_oi=' + cicloplejio_cilindro_oi +
			  '&cicloplejio_eje_oi=' + cicloplejio_eje_oi +
			  '&cicloplejio_lejos_oi=' + cicloplejio_lejos_oi +
			  '&refrafinal_esfera_od=' + refrafinal_esfera_od +
			  '&refrafinal_cilindro_od=' + refrafinal_cilindro_od +
			  '&refrafinal_eje_od=' + refrafinal_eje_od +
			  '&refrafinal_adicion_od=' + refrafinal_adicion_od +
			  '&refrafinal_esfera_oi=' + refrafinal_esfera_oi +
			  '&refrafinal_cilindro_oi=' + refrafinal_cilindro_oi +
			  '&refrafinal_eje_oi=' + refrafinal_eje_oi +
			  '&refrafinal_adicion_oi=' + refrafinal_adicion_oi +
			  '&tipo_guardar=' + tipo +
			  '&presion_intraocular_od=' + presion_intraocular_od +
			  '&presion_intraocular_oi=' + presion_intraocular_oi +
			  '&diagnostico_optometria=' + diagnostico_optometria +
			  '&txt_observaciones_subjetivo=' + txt_observaciones_subjetivo +
			  '&txt_observaciones_rxfinal=' + txt_observaciones_rxfinal +
			  '&cmb_validar_consulta=' + cmb_validar_consulta + 
			  '&cmb_grado_satisfaccion=' + cmb_grado_satisfaccion + 
			  '&rx_anteojos=' + rx_anteojos + 
 			  '&rx_lc=' + rx_lc + 
			  '&rx_refractiva=' + rx_refractiva + 
			  '&alternativa_anteojos=' + alternativa_anteojos + 
			  '&alternativa_lc=' + alternativa_lc + 
			  '&alternativa_refractiva=' + alternativa_refractiva + 
			  '&alternativa_otra=' + alternativa_otra +
			  '&cmb_paciente_dilatado=' + cmb_paciente_dilatado +
			  '&cmb_dominancia_ocular=' + cmb_dominancia_ocular +
			  '&nombre_usuario_alt=' + nombre_usuario_alt +
			  '&observaciones_optometricas_finales=' + observaciones_optometricas_finales +
			  '&observaciones_admision=' + str_encode($("#txt_observaciones_admision").val()) +
			  '&cadena_colores=' + obtener_cadena_colores();
	
    llamarAjax("consulta_optometria_ajax.php", params, "guardar_optometria", "validar_exito(" + ind_imprimir + ")");
}

function validar_exito(ind_imprimir) {
    var hdd_exito = $('#hdd_exito').val();
    var hdd_url_menu = $('#hdd_url_menu').val();
    var hdd_tipo_guardar = $('#hdd_tipo_guardar').val();
    
    if (hdd_tipo_guardar == 1) { //Cierra el formulario
	    if (hdd_exito > 0) {
	    	$('.formulario').css('display', 'none');
	        $("#contenedor_exito").css("display", "block");
	        $('#contenedor_exito').html('Datos guardados correctamente');
	        setTimeout("enviar_credencial('" + hdd_url_menu + "')", 3000);
	    } else {
	        $("#contenedor_error").css("display", "block");
	        $("#contenedor_error").html("Error al guardar la consulta de optometr&iacute;a");
	    }
    } else { //Permanece en el formulario
    	if (hdd_exito > 0) {
	        $("#contenedor_exito").css("display", "block");
	        $('#contenedor_exito').html('Datos guardados correctamente');
	        setTimeout('$("#contenedor_exito").css("display", "none")', 3000);
			
			if (ind_imprimir == 1) {
				imprimir_optometria();
			}
	    } else {
	        $("#contenedor_error").css("display", "block");
	        $("#contenedor_error").html("Error al guardar la consulta de optometr&iacute;a");
	    }
    }
	window.scrollTo(0, 0);
	$("#btn_imprimir").removeAttr("disabled");
	$("#btn_crear").removeAttr("disabled");
	$("#btn_finalizar").removeAttr("disabled");
}

/**
 * 
 * @param {Object} ojo
 * ojo=OD
 * ojo=OI
 */
function copiar_objetivo(ojo) {
	if (ojo=='OD') {
		var refraobj_esfera_od = $('#refraobj_esfera_od').val();
		var refraobj_cilindro_od = $('#refraobj_cilindro_od').val();
		var refraobj_eje_od = $('#refraobj_eje_od').val();
		var refraobj_lejos_od = $('#refraobj_lejos_od').val();
		
		$('#subjetivo_esfera_od').val(refraobj_esfera_od);
		$('#subjetivo_cilindro_od').val(refraobj_cilindro_od);
		$('#subjetivo_eje_od').val(refraobj_eje_od);
		$('#subjetivo_lejos_od').val(refraobj_lejos_od);
	}
	
	if(ojo=='OI'){
		var refraobj_esfera_oi = $('#refraobj_esfera_oi').val();
		var refraobj_cilindro_oi = $('#refraobj_cilindro_oi').val();
		var refraobj_eje_oi = $('#refraobj_eje_oi').val();
		var refraobj_lejos_oi = $('#refraobj_lejos_oi').val();
		
		$('#subjetivo_esfera_oi').val(refraobj_esfera_oi);
		$('#subjetivo_cilindro_oi').val(refraobj_cilindro_oi);
		$('#subjetivo_eje_oi').val(refraobj_eje_oi);
		$('#subjetivo_lejos_oi').val(refraobj_lejos_oi);
	}
}

/**
 * 
 * @param {Object} ojo
 * ojo=OD
 * ojo=OI
 */
function copiar_subjetivo(ojo) {
	if (ojo == 'OD') {
		var subjetivo_esfera_od = $('#subjetivo_esfera_od').val();
		var subjetivo_cilindro_od = $('#subjetivo_cilindro_od').val();
		var subjetivo_eje_od = $('#subjetivo_eje_od').val();
		var subjetivo_adicion_od = $('#subjetivo_adicion_od').val();
		
		$('#refrafinal_esfera_od').val(subjetivo_esfera_od);
		$('#refrafinal_cilindro_od').val(subjetivo_cilindro_od);
		$('#refrafinal_eje_od').val(subjetivo_eje_od);
		$('#refrafinal_adicion_od').val(subjetivo_adicion_od);
	} else if (ojo == 'OI') {
		var subjetivo_esfera_oi = $('#subjetivo_esfera_oi').val();
		var subjetivo_cilindro_oi = $('#subjetivo_cilindro_oi').val();
		var subjetivo_eje_oi = $('#subjetivo_eje_oi').val();
		var subjetivo_adicion_oi = $('#subjetivo_adicion_oi').val();
		
		$('#refrafinal_esfera_oi').val(subjetivo_esfera_oi);
		$('#refrafinal_cilindro_oi').val(subjetivo_cilindro_oi);
		$('#refrafinal_eje_oi').val(subjetivo_eje_oi);
		$('#refrafinal_adicion_oi').val(subjetivo_adicion_oi);
	}
}

function calculo_ejes(eje1, eje2) {
	var val_eje1 = $('#' + eje1).val();
	var val_eje2 = $('#' + eje2).val();
	var val_eje_resul = (parseInt(val_eje1, 10) + 90) % 180;
	if (!isNaN(val_eje_resul)) {
		$('#' + eje2).val(val_eje_resul);
	}
}

function generar_formula_gafas(observaciones, fecha_hc, nombre_paciente, nombre_profesional, esfera_od, cilindro_od, eje_od, adicion_od, esfera_oi, cilindro_oi, eje_oi, adicion_oi, id_admision) {
	var esfera_od = $('#' + esfera_od).val();
	var cilindro_od = $('#' + cilindro_od).val();
	var eje_od = $('#' + eje_od).val();
	var adicion_od = $('#' + adicion_od).val();
	
	var esfera_oi = $('#' + esfera_oi).val();
	var cilindro_oi = $('#' + cilindro_oi).val();
	var eje_oi = $('#' + eje_oi).val();
	var adicion_oi = $('#' + adicion_oi).val();
	
	var observaciones = eval("CKEDITOR.instances." + observaciones + ".getData();");
	
	var params = "opcion=1&id_admision=" + id_admision +
				 "&hdd_nombre_paciente=" + str_encode(nombre_paciente) +
				 "&hdd_fecha_admision=" + str_encode(fecha_hc) +
				 "&esfera_od=" + str_encode(esfera_od) +
				 "&cilindro_od=" + str_encode(cilindro_od) +
				 "&eje_od=" + str_encode(eje_od) +
				 "&adicion_od=" + str_encode(adicion_od) +
				 "&esfera_oi=" + str_encode(esfera_oi) +
				 "&cilindro_oi=" + str_encode(cilindro_oi) +
				 "&eje_oi=" + str_encode(eje_oi) +
				 "&adicion_oi=" + str_encode(adicion_oi) +
				 "&observacion=" + str_encode(observaciones) +
				 "&hdd_nombre_profesional_optometra=" + str_encode(nombre_profesional);
	
	llamarAjax("../historia_clinica/formula_gafas_ajax.php", params, "imprimir_formula", "imprimir_formula_gafas_cont();");
}

function imprimir_formula_gafas_cont() {
	var ruta = $("#hdd_ruta_formula_gafas_pdf").val();
	window.open("../funciones/abrir_pdf.php?ruta=" + ruta + "&nombre_arch=formula_gafas.pdf", "_blank");
}

function imprSelec(muestra) {
	var ficha = document.getElementById(muestra);
	var ventimp = window.open(' ', 'popimpr');
	ventimp.document.write(ficha.innerHTML);
	ventimp.document.close();
	ventimp.print();
}

function enviar_a_estados() {
	validar_crear_optometria(2, 0);
	
	var params = "opcion=3&id_hc=" + $("#hdd_id_hc_consulta").val() +
				 "&id_admision=" + $("#hdd_id_admision").val();
	
	llamarAjax("consulta_optometria_ajax.php", params, "d_interno", "mostrar_formulario_flotante(1);");
}

function seleccionar_ojo_op(id_ojo) {
	switch (id_ojo) {
		case "79":
			$("#avsc_lejos_od").removeAttr("disabled");
			$("#avsc_cerca_od").removeAttr("disabled");
			$("#avsc_lejos_oi").val("");
			$("#avsc_cerca_oi").val("");
			$("#avsc_lejos_oi").attr("disabled", "disabled");
			$("#avsc_cerca_oi").attr("disabled", "disabled");
			
			$("#lenso_esfera_od").removeAttr("disabled");
			$("#lenso_cilindro_od").removeAttr("disabled");
			$("#lenso_eje_od").removeAttr("disabled");
			$("#lenso_lejos_od").removeAttr("disabled");
			$("#lenso_adicion_od").removeAttr("disabled");
			$("#lenso_cerca_od").removeAttr("disabled");
			$("#lenso_esfera_oi").val("");
			$("#lenso_cilindro_oi").val("");
			$("#lenso_eje_oi").val("");
			$("#lenso_lejos_oi").val("");
			$("#lenso_adicion_oi").val("");
			$("#lenso_cerca_oi").val("");
			$("#lenso_esfera_oi").attr("disabled", "disabled");
			$("#lenso_cilindro_oi").attr("disabled", "disabled");
			$("#lenso_eje_oi").attr("disabled", "disabled");
			$("#lenso_lejos_oi").attr("disabled", "disabled");
			$("#lenso_adicion_oi").attr("disabled", "disabled");
			$("#lenso_cerca_oi").attr("disabled", "disabled");
			
			$("#querato_k1_od").removeAttr("disabled");
			$("#querato_ejek1_od").removeAttr("disabled");
			$("#querato_dif_od").removeAttr("disabled");
			$("#querato_k1_oi").val("");
			$("#querato_ejek1_oi").val("");
			$("#querato_dif_oi").val("");
			$("#querato_k1_oi").attr("disabled", "disabled");
			$("#querato_ejek1_oi").attr("disabled", "disabled");
			$("#querato_dif_oi").attr("disabled", "disabled");
			
			$("#refraobj_esfera_od").removeAttr("disabled");
			$("#refraobj_cilindro_od").removeAttr("disabled");
			$("#refraobj_eje_od").removeAttr("disabled");
			$("#refraobj_lejos_od").removeAttr("disabled");
			$("#refraobj_esfera_oi").val("");
			$("#refraobj_cilindro_oi").val("");
			$("#refraobj_eje_oi").val("");
			$("#refraobj_lejos_oi").val("");
			$("#refraobj_esfera_oi").attr("disabled", "disabled");
			$("#refraobj_cilindro_oi").attr("disabled", "disabled");
			$("#refraobj_eje_oi").attr("disabled", "disabled");
			$("#refraobj_lejos_oi").attr("disabled", "disabled");
			
			$("#subjetivo_esfera_od").removeAttr("disabled");
			$("#subjetivo_cilindro_od").removeAttr("disabled");
			$("#subjetivo_eje_od").removeAttr("disabled");
			$("#subjetivo_lejos_od").removeAttr("disabled");
			$("#subjetivo_ph_od").removeAttr("disabled");
			$("#subjetivo_adicion_od").removeAttr("disabled");
			$("#subjetivo_cerca_od").removeAttr("disabled");
			$("#subjetivo_esfera_oi").val("");
			$("#subjetivo_cilindro_oi").val("");
			$("#subjetivo_eje_oi").val("");
			$("#subjetivo_lejos_oi").val("");
			$("#subjetivo_ph_oi").val("");
			$("#subjetivo_adicion_oi").val("");
			$("#subjetivo_cerca_oi").val("");
			$("#subjetivo_esfera_oi").attr("disabled", "disabled");
			$("#subjetivo_cilindro_oi").attr("disabled", "disabled");
			$("#subjetivo_eje_oi").attr("disabled", "disabled");
			$("#subjetivo_lejos_oi").attr("disabled", "disabled");
			$("#subjetivo_ph_oi").attr("disabled", "disabled");
			$("#subjetivo_adicion_oi").attr("disabled", "disabled");
			$("#subjetivo_cerca_oi").attr("disabled", "disabled");
			
			$("#cicloplejio_esfera_od").removeAttr("disabled");
			$("#cicloplejio_cilindro_od").removeAttr("disabled");
			$("#cicloplejio_eje_od").removeAttr("disabled");
			$("#cicloplejio_lejos_od").removeAttr("disabled");
			$("#cicloplejio_esfera_oi").val("");
			$("#cicloplejio_cilindro_oi").val("");
			$("#cicloplejio_eje_oi").val("");
			$("#cicloplejio_lejos_oi").val("");
			$("#cicloplejio_esfera_oi").attr("disabled", "disabled");
			$("#cicloplejio_cilindro_oi").attr("disabled", "disabled");
			$("#cicloplejio_eje_oi").attr("disabled", "disabled");
			$("#cicloplejio_lejos_oi").attr("disabled", "disabled");
			
			$("#refrafinal_esfera_od").removeAttr("disabled");
			$("#refrafinal_cilindro_od").removeAttr("disabled");
			$("#refrafinal_eje_od").removeAttr("disabled");
			$("#refrafinal_adicion_od").removeAttr("disabled");
			$("#refrafinal_esfera_oi").val("");
			$("#refrafinal_cilindro_oi").val("");
			$("#refrafinal_eje_oi").val("");
			$("#refrafinal_adicion_oi").val("");
			$("#refrafinal_esfera_oi").attr("disabled", "disabled");
			$("#refrafinal_cilindro_oi").attr("disabled", "disabled");
			$("#refrafinal_eje_oi").attr("disabled", "disabled");
			$("#refrafinal_adicion_oi").attr("disabled", "disabled");
			
			$("#presion_intraocular_od").removeAttr("disabled");
			$("#presion_intraocular_oi").val("");
			$("#presion_intraocular_oi").attr("disabled", "disabled");
			break;
			
		case "80":
			$("#avsc_lejos_od").val("");
			$("#avsc_cerca_od").val("");
			$("#avsc_lejos_od").attr("disabled", "disabled");
			$("#avsc_cerca_od").attr("disabled", "disabled");
			$("#avsc_lejos_oi").removeAttr("disabled");
			$("#avsc_cerca_oi").removeAttr("disabled");
			
			$("#lenso_esfera_od").val("");
			$("#lenso_cilindro_od").val("");
			$("#lenso_eje_od").val("");
			$("#lenso_lejos_od").val("");
			$("#lenso_adicion_od").val("");
			$("#lenso_cerca_od").val("");
			$("#lenso_esfera_od").attr("disabled", "disabled");
			$("#lenso_cilindro_od").attr("disabled", "disabled");
			$("#lenso_eje_od").attr("disabled", "disabled");
			$("#lenso_lejos_od").attr("disabled", "disabled");
			$("#lenso_adicion_od").attr("disabled", "disabled");
			$("#lenso_cerca_od").attr("disabled", "disabled");
			$("#lenso_esfera_oi").removeAttr("disabled");
			$("#lenso_cilindro_oi").removeAttr("disabled");
			$("#lenso_eje_oi").removeAttr("disabled");
			$("#lenso_lejos_oi").removeAttr("disabled");
			$("#lenso_adicion_oi").removeAttr("disabled");
			$("#lenso_cerca_oi").removeAttr("disabled");
			
			$("#querato_k1_od").val("");
			$("#querato_ejek1_od").val("");
			$("#querato_dif_od").val("");
			$("#querato_k1_od").attr("disabled", "disabled");
			$("#querato_ejek1_od").attr("disabled", "disabled");
			$("#querato_dif_od").attr("disabled", "disabled");
			$("#querato_k1_oi").removeAttr("disabled");
			$("#querato_ejek1_oi").removeAttr("disabled");
			$("#querato_dif_oi").removeAttr("disabled");
			
			$("#refraobj_esfera_od").val("");
			$("#refraobj_cilindro_od").val("");
			$("#refraobj_eje_od").val("");
			$("#refraobj_lejos_od").val("");
			$("#refraobj_esfera_od").attr("disabled", "disabled");
			$("#refraobj_cilindro_od").attr("disabled", "disabled");
			$("#refraobj_eje_od").attr("disabled", "disabled");
			$("#refraobj_lejos_od").attr("disabled", "disabled");
			$("#refraobj_esfera_oi").removeAttr("disabled");
			$("#refraobj_cilindro_oi").removeAttr("disabled");
			$("#refraobj_eje_oi").removeAttr("disabled");
			$("#refraobj_lejos_oi").removeAttr("disabled");
			
			$("#subjetivo_esfera_od").val("");
			$("#subjetivo_cilindro_od").val("");
			$("#subjetivo_eje_od").val("");
			$("#subjetivo_lejos_od").val("");
			$("#subjetivo_ph_od").val("");
			$("#subjetivo_adicion_od").val("");
			$("#subjetivo_cerca_od").val("");
			$("#subjetivo_esfera_od").attr("disabled", "disabled");
			$("#subjetivo_cilindro_od").attr("disabled", "disabled");
			$("#subjetivo_eje_od").attr("disabled", "disabled");
			$("#subjetivo_lejos_od").attr("disabled", "disabled");
			$("#subjetivo_ph_od").attr("disabled", "disabled");
			$("#subjetivo_adicion_od").attr("disabled", "disabled");
			$("#subjetivo_cerca_od").attr("disabled", "disabled");
			$("#subjetivo_esfera_oi").removeAttr("disabled");
			$("#subjetivo_cilindro_oi").removeAttr("disabled");
			$("#subjetivo_eje_oi").removeAttr("disabled");
			$("#subjetivo_lejos_oi").removeAttr("disabled");
			$("#subjetivo_ph_oi").removeAttr("disabled");
			$("#subjetivo_adicion_oi").removeAttr("disabled");
			$("#subjetivo_cerca_oi").removeAttr("disabled");
			
			$("#cicloplejio_esfera_od").val("");
			$("#cicloplejio_cilindro_od").val("");
			$("#cicloplejio_eje_od").val("");
			$("#cicloplejio_lejos_od").val("");
			$("#cicloplejio_esfera_od").attr("disabled", "disabled");
			$("#cicloplejio_cilindro_od").attr("disabled", "disabled");
			$("#cicloplejio_eje_od").attr("disabled", "disabled");
			$("#cicloplejio_lejos_od").attr("disabled", "disabled");
			$("#cicloplejio_esfera_oi").removeAttr("disabled");
			$("#cicloplejio_cilindro_oi").removeAttr("disabled");
			$("#cicloplejio_eje_oi").removeAttr("disabled");
			$("#cicloplejio_lejos_oi").removeAttr("disabled");
			
			$("#refrafinal_esfera_od").val("");
			$("#refrafinal_cilindro_od").val("");
			$("#refrafinal_eje_od").val("");
			$("#refrafinal_adicion_od").val("");
			$("#refrafinal_esfera_od").attr("disabled", "disabled");
			$("#refrafinal_cilindro_od").attr("disabled", "disabled");
			$("#refrafinal_eje_od").attr("disabled", "disabled");
			$("#refrafinal_adicion_od").attr("disabled", "disabled");
			$("#refrafinal_esfera_oi").removeAttr("disabled");
			$("#refrafinal_cilindro_oi").removeAttr("disabled");
			$("#refrafinal_eje_oi").removeAttr("disabled");
			$("#refrafinal_adicion_oi").removeAttr("disabled");
			
			$("#presion_intraocular_od").val("");
			$("#presion_intraocular_od").attr("disabled", "disabled");
			$("#presion_intraocular_oi").removeAttr("disabled");
			break;
			
		case "81":
			$("#avsc_lejos_od").removeAttr("disabled");
			$("#avsc_cerca_od").removeAttr("disabled");
			$("#avsc_lejos_oi").removeAttr("disabled");
			$("#avsc_cerca_oi").removeAttr("disabled");
			
			$("#lenso_esfera_od").removeAttr("disabled");
			$("#lenso_cilindro_od").removeAttr("disabled");
			$("#lenso_eje_od").removeAttr("disabled");
			$("#lenso_lejos_od").removeAttr("disabled");
			$("#lenso_adicion_od").removeAttr("disabled");
			$("#lenso_cerca_od").removeAttr("disabled");
			$("#lenso_esfera_oi").removeAttr("disabled");
			$("#lenso_cilindro_oi").removeAttr("disabled");
			$("#lenso_eje_oi").removeAttr("disabled");
			$("#lenso_lejos_oi").removeAttr("disabled");
			$("#lenso_adicion_oi").removeAttr("disabled");
			$("#lenso_cerca_oi").removeAttr("disabled");
			
			$("#querato_k1_od").removeAttr("disabled");
			$("#querato_ejek1_od").removeAttr("disabled");
			$("#querato_dif_od").removeAttr("disabled");
			$("#querato_k1_oi").removeAttr("disabled");
			$("#querato_ejek1_oi").removeAttr("disabled");
			$("#querato_dif_oi").removeAttr("disabled");
			
			$("#refraobj_esfera_od").removeAttr("disabled");
			$("#refraobj_cilindro_od").removeAttr("disabled");
			$("#refraobj_eje_od").removeAttr("disabled");
			$("#refraobj_lejos_od").removeAttr("disabled");
			$("#refraobj_esfera_oi").removeAttr("disabled");
			$("#refraobj_cilindro_oi").removeAttr("disabled");
			$("#refraobj_eje_oi").removeAttr("disabled");
			$("#refraobj_lejos_oi").removeAttr("disabled");
			
			$("#subjetivo_esfera_od").removeAttr("disabled");
			$("#subjetivo_cilindro_od").removeAttr("disabled");
			$("#subjetivo_eje_od").removeAttr("disabled");
			$("#subjetivo_lejos_od").removeAttr("disabled");
			$("#subjetivo_ph_od").removeAttr("disabled");
			$("#subjetivo_adicion_od").removeAttr("disabled");
			$("#subjetivo_cerca_od").removeAttr("disabled");
			$("#subjetivo_esfera_oi").removeAttr("disabled");
			$("#subjetivo_cilindro_oi").removeAttr("disabled");
			$("#subjetivo_eje_oi").removeAttr("disabled");
			$("#subjetivo_lejos_oi").removeAttr("disabled");
			$("#subjetivo_ph_oi").removeAttr("disabled");
			$("#subjetivo_adicion_oi").removeAttr("disabled");
			$("#subjetivo_cerca_oi").removeAttr("disabled");
			
			$("#cicloplejio_esfera_od").removeAttr("disabled");
			$("#cicloplejio_cilindro_od").removeAttr("disabled");
			$("#cicloplejio_eje_od").removeAttr("disabled");
			$("#cicloplejio_lejos_od").removeAttr("disabled");
			$("#cicloplejio_esfera_oi").removeAttr("disabled");
			$("#cicloplejio_cilindro_oi").removeAttr("disabled");
			$("#cicloplejio_eje_oi").removeAttr("disabled");
			$("#cicloplejio_lejos_oi").removeAttr("disabled");
			
			$("#refrafinal_esfera_od").removeAttr("disabled");
			$("#refrafinal_cilindro_od").removeAttr("disabled");
			$("#refrafinal_eje_od").removeAttr("disabled");
			$("#refrafinal_adicion_od").removeAttr("disabled");
			$("#refrafinal_esfera_oi").removeAttr("disabled");
			$("#refrafinal_cilindro_oi").removeAttr("disabled");
			$("#refrafinal_eje_oi").removeAttr("disabled");
			$("#refrafinal_adicion_oi").removeAttr("disabled");
			
			$("#presion_intraocular_od").removeAttr("disabled");
			$("#presion_intraocular_oi").removeAttr("disabled");
			break;
	}
}

function comprobar_lc_alternativa() {
	if ($("#alternativa_lc").is(":checked")) {
		$("#tr_alternativa_lc").css("display", "table-row");
	} else {
		$("#tr_alternativa_lc").css("display", "none");
	}
}
