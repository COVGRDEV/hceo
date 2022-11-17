/***********************************************/
/*Configuración del editor de texto enriquecido*/
/***********************************************/

if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
	CKEDITOR.tools.enableHtml5Elements(document);
}

CKEDITOR.config.width = "auto";
CKEDITOR.config.height = 55;

var initCKEditorControl = (function(id_obj) {
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

/***********************************************/
/***********************************************/
/***********************************************/

function ajustar_textareas() {
	for (var i in CKEDITOR.instances) {
		(function(i){
			CKEDITOR.instances[i].setData(CKEDITOR.instances[i].getData());
		})(i);
	}
}

/**
 * Validar los campos de control laser
 */
function validar_control_laser_of(){
	var result = 0;
	
	var panel_1 = 0;
	var panel_2 = 0;
	
	$("#panel_control_oft_1").removeClass("borde_error_panel");
	$("#panel_control_oft_1 a").css({"color": "#5B5B5B"});
	$("#panel_control_oft_2").removeClass("borde_error_panel");
	$("#panel_control_oft_2 a").css({"color": "#5B5B5B"});
	
	$("#presion_intraocular_aplanatica_od").removeClass("borde_error");
	$("#presion_intraocular_aplanatica_oi").removeClass("borde_error");
	$("#cke_hallazgos_control_laser").removeClass("borde_error");
	$("#cke_diagnostico_control_laser_of").removeClass("borde_error");
	$("#txt_nombre_usuario_alt").removeClass("borde_error");
	
	$("#cmb_formula_gafas").removeClass("borde_error");
	
	if ($("#presion_intraocular_aplanatica_od").val() == "") {
		$("#presion_intraocular_aplanatica_od").addClass("borde_error");
		result = 1;
		panel_1 = 1;
	}
	if ($("#presion_intraocular_aplanatica_oi").val() == "") {
		$("#presion_intraocular_aplanatica_oi").addClass("borde_error");
		result = 1;
		panel_1 = 1;
	}
	if (CKEDITOR.instances.hallazgos_control_laser.getData() == "") {
		$("#cke_hallazgos_control_laser").addClass("borde_error");
		result = 1;
		panel_1 = 1;
	}
	
	if ($("#cmb_formula_gafas").val() == "" && $("#hdd_ind_optometria").val() == "1") {
		$("#cmb_formula_gafas").addClass("borde_error");
		result = 1;
		panel_2 = 1;
	}
	
	if ($("#hdd_usuario_anonimo").val() == "1" && $("#txt_nombre_usuario_alt").val() == ""){
		$("#txt_nombre_usuario_alt").addClass("borde_error");
		result = 1;
	}
	
	//Formulación de medicamentos
	if (!validar_formulacion_fm()) {
		result = 1;
		panel_2 = 1;
	}
	
	//Validación de diagnósticos
	var result_ciex = validar_diagnosticos_hc(1);
	if (result_ciex < 0) {
		result = result_ciex;
		panel_2 = 1;
	} else {
		//Validación de procedimientos solicitados
		var result_cups_solic = validar_hc_procedimientos_solic();
		if (result_cups_solic < 0) {
			result = result_cups_solic;
			panel_2 = 1;
		}
	}
	
	return result;
}

/**
 *tipo:
 * 1=Guardar y cambiar de estado la consulta
 * 2=Guardar y NO cambiar el estado de la consulta SIN VALIDAR LOS CAMPOS
 */
function crear_control_laser_of(tipo, ind_imprimir) {
	switch (tipo) {
		case 1: //Finalizar consulta
		case 3: //Guardar desde la historia
		case 4: //Finalizar preconsulta
		case 5: //Finalizar consulta desde traslado
		case 6: //Finalizar preconsulta desde traslado
			$("#contenedor_error").css("display", "none");
			var resultado = validar_control_laser_of();
			if (resultado == 0) {
				editar_consulta_control_laser_of(tipo, ind_imprimir);
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
			}
			break;
			
		case 2: //Guardar cambios
			//Se validan duplicados de diagnósticos
			if (validar_duplicados_diagnosticos_hc() != -2) {
				if (validar_hc_procedimientos_solic() != -3) {
					editar_consulta_control_laser_of(tipo, ind_imprimir);
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

function imprimir_control_laser_of() {
	var params = "id_hc=" + $("#hdd_id_hc_consulta").val();
	
	llamarAjax("../historia_clinica/impresion_historia_clinica.php", params, "d_impresion_hc", "continuar_imprimir_control_laser_of();");
}

function continuar_imprimir_control_laser_of() {
	var ruta = $("#hdd_ruta_arch_hc_pdf").val();
	window.open("../funciones/abrir_pdf.php?ruta=" + ruta + "&nombre_arch=consulta_control_laser_oftalmologia.pdf", "_blank");
}

/**
 *tipo:
 * 1=Guardar y cambiar de estado la consulta
 * 2=Guardar y NO cambiar el estado de la consulta 
 */
function editar_consulta_control_laser_of(tipo, ind_imprimir){
	var hdd_id_hc_consulta = $("#hdd_id_hc_consulta").val();
	var hdd_id_admision = $("#hdd_id_admision").val();
	var	presion_intraocular_aplanatica_od = $("#presion_intraocular_aplanatica_od").val();
	var	presion_intraocular_aplanatica_oi = $("#presion_intraocular_aplanatica_oi").val();
	var hallazgos_control_laser = CKEDITOR.instances.hallazgos_control_laser.getData();
	var	diagnostico_control_laser_of = CKEDITOR.instances.diagnostico_control_laser_of.getData();
	
	var	solicitud_examenes_control_laser = CKEDITOR.instances.solicitud_examenes_control_laser.getData();
	var	tratamiento_control_laser = CKEDITOR.instances.tratamiento_control_laser.getData();
	var	medicamentos_control_laser = $("#medicamentos_control_laser").val();
	var nombre_usuario_alt = $("#txt_nombre_usuario_alt").val();
	var ind_formula_gafas = $("#cmb_formula_gafas").val();
	
	var params = "opcion=1";
	
	//Para Diagnosticos
	var cant_ciex = $("#lista_tabla").val()
	params += "&cant_ciex=" + cant_ciex;
	for (i = 1; i <= cant_ciex; i++) {
	 	 var cod_ciex = $("#hdd_ciex_diagnostico_"+i).val();
	 	 var val_ojos = $("#valor_ojos_"+i).val();
	 	 if (cod_ciex != "") {
	 	 	params += "&cod_ciex_" + i + "=" + cod_ciex + "&val_ojos_" + i + "=" + val_ojos;
	 	 }
	}
	
	params += "&hdd_id_hc_consulta=" + hdd_id_hc_consulta +
			  "&hdd_id_admision=" + hdd_id_admision +
			  "&presion_intraocular_aplanatica_od=" + str_encode(presion_intraocular_aplanatica_od) +
			  "&presion_intraocular_aplanatica_oi=" + str_encode(presion_intraocular_aplanatica_oi) +
			  "&hallazgos_control_laser=" + str_encode(hallazgos_control_laser) +
			  "&diagnostico_control_laser_of=" + str_encode(diagnostico_control_laser_of) +
			  "&tipo_guardar=" + tipo +
			  "&solicitud_examenes_control_laser=" + str_encode(solicitud_examenes_control_laser) +
			  "&tratamiento_control_laser=" + str_encode(tratamiento_control_laser) +
			  "&medicamentos_control_laser=" + str_encode(medicamentos_control_laser) +
			  "&nombre_usuario_alt=" + str_encode(nombre_usuario_alt) +
			  "&ind_formula_gafas=" + ind_formula_gafas;
	
	//Solicitud de procedimientos
	params += obtener_parametros_proc_solic();
	
	//Formulación de medicamentos
	params += obtener_parametros_formulacion_fm();
	
	llamarAjax("consulta_control_laser_ajax_of.php", params, "guardar_control_laser_of", "validar_exito(" + ind_imprimir + ")");
}

function validar_exito(ind_imprimir) {
    var hdd_exito = $("#hdd_exito").val();
    var hdd_url_menu = $("#hdd_url_menu").val();
    var hdd_tipo_guardar = $("#hdd_tipo_guardar").val();
    var hdd_exito_formulacion_fm = $("#hdd_exito_formulacion_fm").val();
	var hdd_exito_hc_procedimientos_solic = $("#hdd_exito_hc_procedimientos_solic").val();
	
    if(hdd_tipo_guardar == 1 || hdd_tipo_guardar == 4) { //Cierra el formulario
    	$(".formulario").css("display", "none");
	    if (hdd_exito > 0 && hdd_exito_formulacion_fm > 0 && hdd_exito_hc_procedimientos_solic > 0) {
	        $("#contenedor_exito").css("display", "block");
	        $("#contenedor_exito").html("Datos guardados correctamente");
	        setTimeout("enviar_credencial('" + hdd_url_menu + "')", 3000);
	    } else if (hdd_exito <= 0) {
	        $("#contenedor_error").css("display", "block");
	        $("#contenedor_error").html("Error al guardar la consulta");
		} else if (hdd_exito_formulacion_fm <= 0){
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la formulaci&oacute;n de medicamentos");
		} else {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la solicitud de procedimientos y ex&aacute;menes");
		}
    } else if(hdd_tipo_guardar == 2 || hdd_tipo_guardar == 3) { //Permanece en el formulario
    	if (hdd_exito > 0 && hdd_exito_formulacion_fm > 0 && hdd_exito_hc_procedimientos_solic > 0) {
	        $("#contenedor_exito").css("display", "block");
	        $("#contenedor_exito").html("Datos guardados correctamente");
	        setTimeout('$("#contenedor_exito").css("display", "none")', 3000);
			
			if (ind_imprimir == 1) {
				imprimir_control_laser_of();
			}
	    } else if (hdd_exito <= 0) {
	        $("#contenedor_error").css("display", "block");
	        $("#contenedor_error").html("Error al guardar la consulta");
		} else if (hdd_exito_formulacion_fm <= 0){
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la formulaci&oacute;n de medicamentos");
		} else {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la solicitud de procedimientos y ex&aacute;menes");
		}
    }
	window.scrollTo(0, 0);
}

function enviar_a_estados() {
	crear_control_laser_of(2, 0);
	
	var params = "opcion=2&id_hc=" + $("#hdd_id_hc_consulta").val() +
				 "&id_admision=" + $("#hdd_id_admision").val() +
				 "&ind_preconsulta=" + $("#hdd_ind_preconsulta").val();
	
	llamarAjax("consulta_control_laser_ajax_of.php", params, "d_interno", "mostrar_formulario_flotante(1);");
}

function ajustar_div_optometria() {
	$("#div_consulta_optometria").height($("#HcFrame").contents().height() + 100);
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
			var id_lugar_cita = $('#hdd_id_lugar_cita').val();
			var id_admision = $('#hdd_id_admision').val();
			
		}else{	
		
			var id_paciente = $('#hdd_id_paciente_hc').val();
			var id_lugar_cita = $('#hdd_id_lugar_cita_hc').val();	
			var id_admision = $('#hdd_id_admision').val();		
			
		}	 
		
				
			var id_profesional = $('#hdd_id_profesional').val();
			var id_usuario = $('#hdd_id_usuario').val();
			var id_convenio = $('#hdd_id_convenio_hc').val();
			var id_plan = $('#hdd_id_plan_hc').val();
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
					 
		llamarAjax("../despacho/despacho_ajax.php", params, "guardar_control_laser_of", "imprimir_incapacidad();");	
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
	
	var params = 	"opcion=3&id_incapacidad="	+	id_incapacidad	+
							 "&dias="           +   dias;
		
		llamarAjax("../despacho/despacho_ajax.php", params, "guardar_control_laser_of", "imprimir_incapacidad_cont();");

	}else{	
	
		 swal({
				title: "Diagnóstico",
				type: "error",
				text: "Error al guardar la incapacidad",
				showConfirmButton: false,
				showCloseButton: true,
			});
	}	
}
	
function imprimir_incapacidad_cont(){
	var ruta = $("#hdd_ruta_incapacidad").val();
	window.open("../funciones/abrir_pdf.php?ruta=" + ruta + "&nombre_arch=incapacidad.pdf", "_blank");
}

