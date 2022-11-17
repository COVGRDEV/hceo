/***********************************************/
/*Configuración del editor de texto enriquecido*/
/***********************************************/

if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
	CKEDITOR.tools.enableHtml5Elements(document);
}

CKEDITOR.config.width = "auto";
CKEDITOR.config.height = 55;

var initCKEditorEvolucion = (function(id_obj) {
	var wysiwygareaAvailable = isWysiwygareaAvailable(),
		isBBCodeBuiltIn = !!CKEDITOR.plugins.get("bbcode");
	
	return function(id_obj) {
		var editorElement = CKEDITOR.document.getById(id_obj);
		
		//Dependiendo de la disponibilidad del plugin wysiwygare se incia el editor clásico o el editor en línea.
		if (wysiwygareaAvailable) {
			CKEDITOR.replace(id_obj);
		} else {
			editorElement.setAttribute("contenteditable", "true");
			CKEDITOR.inline(id_obj);
		}
	};
	
	function isWysiwygareaAvailable() {
		if (CKEDITOR.revision == ("%RE" + "V%")) {
			return true;
		}
		
		return !!CKEDITOR.plugins.get("wysiwygarea");
	}
} )();

var initCKEditorTratEvol = (function() {
	var wysiwygareaAvailable = isWysiwygareaAvailable(),
		isBBCodeBuiltIn = !!CKEDITOR.plugins.get("bbcode");
	
	return function() {
		var editorElement = CKEDITOR.document.getById("txt_tratamiento_evolucion");
		
		//Dependiendo de la disponibilidad del plugin wysiwygare se incia el editor clásico o el editor en línea.
		if (wysiwygareaAvailable) {
			CKEDITOR.replace("txt_tratamiento_evolucion");
		} else {
			editorElement.setAttribute("contenteditable", "true");
			CKEDITOR.inline("txt_tratamiento_evolucion");
		}
	};
	
	function isWysiwygareaAvailable() {
		if (CKEDITOR.revision == ("%RE" + "V%")) {
			return true;
		}
		
		return !!CKEDITOR.plugins.get("wysiwygarea");
	}
} )();

/***********************************************/
/***********************************************/
/***********************************************/

//var arr_textarea_ids = [];
function ajustar_textareas() {
	/*for (i = 0; i < arr_textarea_ids.length; i++) {
		$("#" + arr_textarea_ids[i]).trigger("input");
	}*/
	
	for (var i in CKEDITOR.instances) {
		(function(i){
			CKEDITOR.instances[i].setData(CKEDITOR.instances[i].getData());
		})(i);
	}
}

function ocultar_panels_evolucion() {
	$("#panel2-1").removeClass("active");
	$("#panel2-3").removeClass("active");
	$("#panel2-4").removeClass("active");
	$("#panel2-5").removeClass("active");
	$("#panel2-6").removeClass("active");
	$("#panel2-7").removeClass("active");
}

function mostrar_formulario_flotante(tipo){
	if(tipo==1){//mostrar
		$("#fondo_negro").css("display", "block");
		$("#d_centro").slideDown(400).css("display", "block");
	}
	else if(tipo==0){//Ocultar
		$("#fondo_negro").css("display", "none");
		$("#d_centro").slideDown(400).css("display", "none");
	}
}

function reducir_formulario_flotante(ancho, alto){ //480, 390
	$(".div_centro").width(ancho);
	$(".div_centro").height(alto);
	$(".div_centro").css("top", "20%");
	$(".div_interno").width(ancho - 15);
	$(".div_interno").height(alto - 35);
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
	if (text == "") {
		ind_existe = 1;//Si Existe
	}
	if (ind_existe == 0) {
		alert("Valor incorrecto");
		document.getElementById(id.id).value = "";
		input = id.id;
		setTimeout("document.getElementById(input).focus()", 75); 
	}
}

function mostrar_formulario(tipo) {
    if (tipo == 1) {//mostrar
        $(".formulario").slideDown(600).css("display", "block");
    }
    else if (tipo == 0) {//Ocultar
        $(".formulario").slideUp(600).css("display", "none");
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
			var resultado = validar_evolucion();
			if (resultado == 0) {
				editar_consulta_evolucion(tipo, ind_imprimir);
			} else {
				$("#contenedor_error").css("display", "block");
				if (resultado == -2) {
					$("#contenedor_error").html("Error - existen diagn&oacute;sticos duplicados");
				} else if (resultado == -3) {
					$("#contenedor_error").html("Error - existen procedimientos duplicados");
				} else {
					$("#contenedor_error").html("Los campos marcados en rojo son obligatorios");
				}
				window.scroll(0, 0);
				$("#btn_imprimir").removeAttr("disabled");
				$("#btn_crear").removeAttr("disabled");
				$("#btn_finalizar").removeAttr("disabled");
			}
			break;
		case 2: //Guardar cambios
			//Se validan duplicados de diagnósticos
			if (validar_duplicados_diagnosticos_hc() != -2) {
				if (validar_hc_procedimientos_solic() != -3) {
					editar_consulta_evolucion(tipo, ind_imprimir);
				} else {
					$("#contenedor_error").css("display", "block");
					$("#contenedor_error").html("Error - existen procedimientos duplicados");
					window.scroll(0, 0);
				}
			} else {
				$("#contenedor_error").css("display", "block");
				$("#contenedor_error").html("Error - existen diagn&oacute;sticos duplicados");
				window.scroll(0, 0);
			}
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
	var resultado = 0;
	var panel_1 = 0;
	var panel_2 = 0;
	var panel_3 = 0;
	var panel_4 = 0;
	var panel_5 = 0;
	var panel_6 = 0;
	var panel_7 = 0;
	
	$("#panel_oft_1").removeClass("borde_error_panel");
	$("#panel_oft_1 a").css({"color": "#5B5B5B"});
	$("#panel_oft_2").removeClass("borde_error_panel");
	$("#panel_oft_2 a").css({"color": "#5B5B5B"});
	$("#panel_oft_3").removeClass("borde_error_panel");
	$("#panel_oft_3 a").css({"color": "#5B5B5B"});
	$("#panel_oft_4").removeClass("borde_error_panel");
	$("#panel_oft_4 a").css({"color": "#5B5B5B"});
	$("#panel_oft_5").removeClass("borde_error_panel");
	$("#panel_oft_5 a").css({"color": "#5B5B5B"});
	$("#panel_oft_6").removeClass("borde_error_panel");
	$("#panel_oft_6 a").css({"color": "#5B5B5B"});
	$("#panel_oft_7").removeClass("borde_error_panel");
	$("#panel_oft_7 a").css({"color": "#5B5B5B"});
	
	$("#cmb_antec_cx_refrac").removeClass("borde_error");
	
    $("#cke_txt_evolucion").removeClass("borde_error");
	$("#txt_nombre_usuario_alt").removeClass("borde_error");
	$("#cmb_formula_gafas").removeClass("borde_error");
	
	if ($("#cmb_antec_cx_refrac").val() == "") {
		$("#cmb_antec_cx_refrac").addClass("borde_error");
		resultado = -1; 
		panel_3 = 1;
	}
	
    if (CKEDITOR.instances.txt_evolucion.getData() == "") {
		$("#cke_txt_evolucion").addClass("borde_error");
		resultado = -1;
		panel_2 = 1;
	}
	
	if ($("#cmb_formula_gafas").val() == "" && $("#hdd_ind_optometria").val() == "1") {
		$("#cmb_formula_gafas").addClass("borde_error");
		resultado = -1;
		panel_2 = 1;
	}
	
	var num_diag_oblig = parseInt($("#hdd_num_diag_oblig").val(), 10);
	for (var i = 1; i <= num_diag_oblig; i++) {
		if ($("#hdd_ciex_diagnostico_" + i).val() == "") {
			$("#ciex_diagnostico_" + i).addClass("borde_error");
			resultado = -1;
			panel_2 = 1;
		}
		if ($("#valor_ojos_" + i).val() == "") {
			$("#valor_ojos_" + i).addClass("borde_error");
			resultado = -1;
			panel_2 = 1;
		}
	}
	
	//Extensión de antecedentes
	if (!validar_antec_extension()) {
		resultado = -1;
		panel_3 = 1;
	}
	
	//Formulación de medicamentos
	if (!validar_formulacion_fm()) {
		resultado = -1;
		panel_2 = 1;
	}
	
	if ($("#hdd_usuario_anonimo").val() == "1" && $("#txt_nombre_usuario_alt").val() == ""){
		$("#txt_nombre_usuario_alt").addClass("borde_error");
		resultado = -1;
		panel_2 = 1;
	}
	
	//Validación de diagnósticos
	var result_ciex = validar_diagnosticos_hc(1);
	if (result_ciex < 0) {
		resultado = result_ciex;
		panel_2 = 1;
	} else {
		//Validación de procedimientos solicitados
		var result_cups_solic = validar_hc_procedimientos_solic();
		if (result_cups_solic < 0) {
			resultado = result_cups_solic;
			panel_2 = 1;
		}
	}
	
	//Validación de registros adicionales
	var tipo_reg_adicional = $("#hdd_tipo_reg_adicional").val();
	
	switch (tipo_reg_adicional) {
		case "2": //Retina
			var result_aux = validar_consulta_oftalmologia_retina();
			if (result_aux < 0) {
				resultado = -1;
				panel_4 = 1;
			}
			break;
		case "3": //Oculoplastia
			var result_aux = validar_consulta_oculoplastia();
			if (result_aux < 0) {
				resultado = -1;
				panel_5 = 1;
			}
			break;
		case "4": //Pterigio
			var result_aux = validar_consulta_pterigio();
			if (result_aux < 0) {
				resultado = -1;
				panel_6 = 1;
			}
			break;			
		case "5": //NESO
			var result_aux = validar_consulta_neso(); 
			if (result_aux < 0) {
				resultado = -1;
				panel_7 = 1;
			}
			break;				
	}
	
	if (panel_1 == 1) {
	   $("#panel_oft_1").addClass("borde_error_panel");
	   $("#panel_oft_1 a").css({"color": "#FF002A"});
	}
	if (panel_2 == 1) {
	   $("#panel_oft_2").addClass("borde_error_panel");
	   $("#panel_oft_2 a").css({"color": "#FF002A"});
	}
	if (panel_3 == 1) {
	   $("#panel_oft_3").addClass("borde_error_panel");
	   $("#panel_oft_3 a").css({"color": "#FF002A"});
	}
	if (panel_4 == 1) {
	   $("#panel_oft_4").addClass("borde_error_panel");
	   $("#panel_oft_4 a").css({"color": "#FF002A"});
	}
	if (panel_5 == 1) {
	   $("#panel_oft_5").addClass("borde_error_panel");
	   $("#panel_oft_5 a").css({"color": "#FF002A"});
	}
	if (panel_6 == 1) {
	   $("#panel_oft_6").addClass("borde_error_panel");
	   $("#panel_oft_6 a").css({"color": "#FF002A"});
	} 	
	if (panel_7 == 1) {
	   $("#panel_oft_7").addClass("borde_error_panel");
	   $("#panel_oft_7 a").css({"color": "#FF002A"});
	}	
	
	return resultado;
}

/*****Formulario de incapacidad*****/

function convertDateFormat(string) {
  var info = string.split('/');
  return info[2] + '-' + info[1] + '-' + info[0];
}

function calcular_diff_fechas(){
	
	var fecha_inicial 	= $('#fechaInicial').val();
	var fecha_inicial	= moment(convertDateFormat(fecha_inicial));
	var fecha_final 	= $('#fechaFinal').val();
	var fecha_final		= moment(convertDateFormat(fecha_final));
	var dias 			= fecha_final.diff(fecha_inicial, 'days');

	if(dias<0){
				 swal({
				title: "Fechas incorrectas",
				type: "warning",
				text: "La fecha final es menor a la fecha inicial",
				showConfirmButton: false,
				showCloseButton: true,
			});
	}
	dias = dias + 1;
	if(dias > 0){
		document.getElementById("hdd_diferencia_dias").innerHTML = dias + " días";	
	}else{
		document.getElementById("hdd_diferencia_dias").innerHTML = 0 + " días";	
	}
}

function guardar_incapacidad(){

	if($('#hdd_rta_hc').val() == 1){
	
			var id_paciente = $('#hdd_id_paciente').val();
			var id_convenio = $('#hdd_id_convenio').val();
			var id_plan = $('#hdd_id_plan').val();
			var id_lugar_cita = $('#hdd_id_lugar_cita').val();
			var id_admision = $('#hdd_id_admision').val();

	}else{	
		
			var id_paciente = $('#hdd_id_paciente_hc').val();
			var id_convenio = $('#hdd_id_convenio_hc').val();
			var id_plan = $('#hdd_id_plan_hc').val();
			var id_lugar_cita = $('#hdd_id_lugar_cita_hc').val();
			var id_admision = $('#hdd_id_admision').val();
			
	}	 
		
			var id_profesional = $('#hdd_id_profesional').val();
			var id_usuario = $('#hdd_id_usuario').val();
			var tipo_atencion = $('#cmb_tipo_atencion_hc').val();
			var origen_incapacidad = $('#cmb_origen_incapacidad_hc').val();
			var prorroga = $('#cmb_prorroga_hc').val();
			var fecha_inicial = $('#fechaInicial').val();
			var fecha_final = $('#fechaFinal').val();
			var observaciones = str_encode(eval("CKEDITOR.instances.txt_observaciones_adicionales.getData()"));
			var cod_ciex = $('#hdd_ciex_diagnostico_1').val();
			var cod_ciex_rel = $('#hdd_ciex_diagnostico_2').val();			
			var id_hc = $('#hdd_id_hc').val();
		
	 if (fecha_inicial == '' || fecha_final == '' || origen_incapacidad == '' || prorroga == '' || tipo_atencion == '' || cod_ciex == '') {

			$('#fechaInicial').addClass('error');
			$('#fechaFinal').addClass('error');
			$('#cmb_prorroga_hc').addClass('error');
			$('#cmb_tipo_atencion_hc').addClass('error');
			$('#cmb_origen_incapacidad_hc').addClass('error');
			
		 swal({
				title: "Campos vacíos",
				type: "error",
				text: "Por favor, diligencie el formulario con los datos requeridos",
				showConfirmButton: false,
				showCloseButton: true,
			});
			if(cod_ciex == ''){
				$('#ciex_diagnostico_1').addClass('error');
				 swal({
					title: "Error",
					type: "error",
					text: "El código del diagnóstico no puede ser vacío",
					showConfirmButton: false,
					showCloseButton: true,
				});
			}

    } else {
		
  		fecha_inicial = fecha_inicial.split('/');
        fecha_inicial = fecha_inicial[2] + '-' + fecha_inicial[1] + '-' + fecha_inicial[0];
        fecha_final = fecha_final.split('/');
        fecha_final = fecha_final[2] + '-' + fecha_final[1] + '-' + fecha_final[0];

		var params = "opcion=2&id_paciente=" + id_paciente +
				 "&id_profesional=" + id_profesional +
				 "&id_usuario=" + id_usuario +
				 "&tipo_atencion=" + tipo_atencion +
				 "&origen_incapacidad=" + origen_incapacidad +
				 "&prorroga=" + prorroga +
				 "&fecha_inicial=" + fecha_inicial +
				 "&fecha_final=" + fecha_final +
				 "&observaciones=" + observaciones +
				 "&id_convenio=" + id_convenio + 
				 "&id_plan=" + id_plan +
				 "&id_lugar_cita=" + id_lugar_cita +
				 "&id_admision=" + id_admision +
				 "&cod_ciex=" + cod_ciex +
				 "&cod_ciex_rel=" + cod_ciex_rel +
				 "&id_hc=" + id_hc +
				 "&observaciones=" + observaciones;
				 
		llamarAjax("../despacho/despacho_ajax.php", params, "d_guardar_evolucion", "imprimir_incapacidad();");	
    } 
}

function imprimir_incapacidad(){
	var rta_guardar = $('#hdd_rta_guardar_incapacidad').val();		

	if(rta_guardar > 0){
	
	var fecha_inicial = $('#fechaInicial').val();
	var fecha_final = $('#fechaFinal').val();
	var id_incapacidad = rta_guardar;
	var fecha_inicial_diff	= moment(convertDateFormat(fecha_inicial));
	var fecha_final_diff	= moment(convertDateFormat(fecha_final));
	var dias 				= fecha_final_diff.diff(fecha_inicial_diff, 'days');	
	dias = dias + 1;
	
	if(dias<0){
		dias = 0;
	}
	
	var params = 	"opcion=3&id_incapacidad="			+	id_incapacidad			+
							"&dias="             		+   dias;
							
		llamarAjax("../despacho/despacho_ajax.php", params, "d_guardar_evolucion","imprimir_incapacidad_cont();");

	}else{	
		 swal({
				title: "Error",
				type: "error",
				text: "Error al momento de imprimir la incapacidad",
				showConfirmButton: false,
				showCloseButton: true,
		});
	}	
}
	
function imprimir_incapacidad_cont(){
var ruta = $("#hdd_ruta_incapacidad").val();
	window.open("../funciones/abrir_pdf.php?ruta=" + ruta + "&nombre_arch=incapacidad.pdf", "_blank");
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
	
	var id_hc = $("#hdd_id_hc_consulta").val();
	var id_admision = $("#hdd_id_admision").val();
	var texto_evolucion = str_encode(CKEDITOR.instances.txt_evolucion.getData());
	var diagnostico_evolucion = str_encode(CKEDITOR.instances.txt_diagnostico_evolucion.getData());
	var solicitud_examenes_evolucion = str_encode(CKEDITOR.instances.txt_solicitud_examenes_evolucion.getData());
	var tratamiento_evolucion = str_encode(CKEDITOR.instances.txt_tratamiento_evolucion.getData());
	var medicamentos_evolucion = str_encode($("#medicamentos_evolucion").val());
	var nombre_usuario_alt = str_encode($("#txt_nombre_usuario_alt").val());
	var ind_formula_gafas = $("#cmb_formula_gafas").val();
	var desc_antecedentes_medicos = str_encode(CKEDITOR.instances.txt_desc_antecedentes_medicos.getData());
	var ind_antec_cx_refrac = $("#cmb_antec_cx_refrac").val();
	var observaciones_tonometria = str_encode(CKEDITOR.instances.txt_observaciones_tonometria.getData());
	
	//Antecedentes medicos
	var cant_antecedentes = parseInt($("#hdd_cant_antecedentes").val(), 10);
	var array_antecedentes_medicos_ids = new Array();
	var array_antecedentes_medicos_val = new Array();
	for (var i = 0; i < cant_antecedentes; i++) {
		array_antecedentes_medicos_ids.push($("#hdd_ant_med_" + i).val());
		array_antecedentes_medicos_val.push($("#chk_ant_med_" + i).is(":checked"));
	}
	
	var params = "opcion=1&id_hc=" + id_hc +
				 "&id_admision=" + id_admision +
	             "&texto_evolucion=" + texto_evolucion +
				 "&tipo_guardar=" + tipo +
				 "&diagnostico_evolucion=" +diagnostico_evolucion +
				 "&solicitud_examenes_evolucion=" + solicitud_examenes_evolucion +
				 "&tratamiento_evolucion=" + tratamiento_evolucion +
				 "&medicamentos_evolucion=" + medicamentos_evolucion +
				 "&nombre_usuario_alt=" + nombre_usuario_alt +
				 "&ind_formula_gafas=" + ind_formula_gafas +
				 "&array_antecedentes_medicos_ids=" + array_antecedentes_medicos_ids +
				 "&array_antecedentes_medicos_val=" + array_antecedentes_medicos_val +
				 "&desc_antecedentes_medicos=" + desc_antecedentes_medicos +
				 "&ind_antec_cx_refrac=" + ind_antec_cx_refrac +
				 "&observaciones_tonometria=" + observaciones_tonometria;
	
	//Extensión de antecedentes médicos
	params += obtener_parametros_antec_extension();
	
	//Para Diagnosticos
	var cant_ciex = $("#lista_tabla").val()
	params += "&cant_ciex=" + cant_ciex;
	for (i = 1; i <= cant_ciex; i++) {
		var cod_ciex = $("#hdd_ciex_diagnostico_" + i).val();
		var val_ojos = $("#valor_ojos_" + i).val();
		if (cod_ciex != "") {
			params += "&cod_ciex_" + i + "=" + cod_ciex +
					  "&val_ojos_" + i + "=" + val_ojos;
		}
	}
	
	//Tonometria
	params += obtener_parametros_tonometria();
	
	//Solicitud de procedimientos
	params += obtener_parametros_proc_solic();
	
	//Formulación de medicamentos
	params += obtener_parametros_formulacion_fm();
	
	//Registros adicionales
	var tipo_reg_adicional = $("#hdd_tipo_reg_adicional").val();
	params += "&tipo_reg_adicional=" + tipo_reg_adicional;
	switch (tipo_reg_adicional) {
		case "2": //Retina
			params += obtener_parametros_consulta_oftalmologia_retina();
			break;
		case "3": //Oculoplastia
			params += obtener_parametros_consulta_oculoplastia();
			break;
		case "4": //Pterigio
			params += obtener_parametros_consulta_pterigio();
			break;			
		case "5": //NESO
			params += obtener_parametros_consulta_neso();
			break;			
	}
	
	llamarAjax("evolucion_ajax.php", params, "d_guardar_evolucion", "validar_exito(" + ind_imprimir + ")");
}

function validar_exito(ind_imprimir) {
	var hdd_exito = $("#hdd_exito").val();
	var hdd_url_menu = $("#hdd_url_menu").val();
	var hdd_tipo_guardar = $("#hdd_tipo_guardar").val();
	var hdd_exito_formulacion_fm = $("#hdd_exito_formulacion_fm").val();
	var hdd_exito_hc_procedimientos_solic = $("#hdd_exito_hc_procedimientos_solic").val();
	
	if (hdd_tipo_guardar == 1) { //Cierra el formulario
		if (hdd_exito > 0 && hdd_exito_formulacion_fm > 0 && hdd_exito_hc_procedimientos_solic > 0) {
			$("#frm_consulta_evolucion").css("display", "none");
			$("#contenedor_exito").css("display", "block");
			$("#contenedor_exito").html("Datos guardados correctamente");
			setTimeout("enviar_credencial('" + hdd_url_menu + "')", 3000);
		} else if (hdd_exito <= 0) {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la evoluci&oacute;n");
		} else if (hdd_exito_formulacion_fm <= 0){
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la formulaci&oacute;n de medicamentos");
		} else {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la solicitud de procedimientos y ex&aacute;menes");
		}
	} else if (hdd_tipo_guardar == 2) { //Permanece en el formulario
		if (hdd_exito > 0 && hdd_exito_formulacion_fm > 0 && hdd_exito_hc_procedimientos_solic > 0) {
			$("#contenedor_exito").css("display", "block");
			$("#contenedor_exito").html("Datos guardados correctamente");
			setTimeout('$("#contenedor_exito").css("display", "none")', 3000);
			
			if (ind_imprimir == 1) {
				imprimir_evolucion();
			}
		} else if (hdd_exito <= 0) {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la evoluci&oacute;n");
		} else if (hdd_exito_formulacion_fm <= 0){
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la formulaci&oacute;n de medicamentos");
		} else {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la solicitud de procedimientos y ex&aacute;menes");
		}
		reset_uploaders(); 
	} else if (hdd_tipo_guardar == 3) { //Permanece en el formulario
		if (hdd_exito > 0 && hdd_exito_formulacion_fm > 0 && hdd_exito_hc_procedimientos_solic > 0) {
			$("#contenedor_exito").css("display", "block");
			$("#contenedor_exito").html("Datos guardados correctamente");
			setTimeout('$("#contenedor_exito").css("display", "none")', 3000);
			
			if (ind_imprimir == 1) {
				imprimir_evolucion();
			}
		} else if (hdd_exito <= 0) {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la evoluci&oacute;n");
		} else if (hdd_exito_formulacion_fm <= 0){
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la formulaci&oacute;n de medicamentos");
		} else {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la solicitud de procedimientos y ex&aacute;menes");
		}
		reset_uploaders(); 
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

function ajustar_div_optometria() {
	$("#div_consulta_optometria").height($("#HcFrame").contents().height() + 100);
}
