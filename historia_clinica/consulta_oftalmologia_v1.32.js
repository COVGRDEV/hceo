/***********************************************/
/*Configuración del editor de texto enriquecido*/
/***********************************************/

if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
	CKEDITOR.tools.enableHtml5Elements(document);
}

CKEDITOR.config.width = "auto";
CKEDITOR.config.height = 55;

var initCKEditorOftalmo = (function(id_obj) {
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

var arr_textarea_ids = [];
function ajustar_textareas() {
	for (i = 0; i < arr_textarea_ids.length; i++) {
		$("#" + arr_textarea_ids[i]).trigger("input");
	}
	
	for (var i in CKEDITOR.instances) {
		(function(i){
			CKEDITOR.instances[i].setData(CKEDITOR.instances[i].getData());
		})(i);
	}
}

function valida_hora(valor) {
   //que no existan elementos sin escribir
   if (valor.indexOf("_") == -1) {
      var hora = valor.split(":")[0];
      if (parseInt(hora) > 23) {
           $("#tonometria_hora").val("");		      
      }
   }
}

/**
 *tipo:
 * 1=Guardar y cambiar de estado la consulta
 * 2=Guardar y NO cambiar el estado de la consulta SIN VALIDAR LOS CAMPOS
 */
function crear_oftalmologia(tipo, ind_imprimir) {
	switch (tipo) { 
		case 1: //Finalizar consulta
		case 3: //Guardar desde historia
		case 4: //Finalizar preconsulta
		case 5: //Finalizar consulta desde traslado
		case 6: //Finalizar preconsulta desde traslado
			$("#btn_imprimir").attr("disabled", "disabled");
			$("#btn_crear").attr("disabled", "disabled");
			$("#btn_finalizar").attr("disabled", "disabled");
			
			$("#contenedor_error").css("display", "none");
			var resultado = validar_oftalmologia();
			if (resultado == 0) {
				editar_consulta_oftalmologia(tipo, ind_imprimir);
			} else {
				if (resultado == -2) {
					$("#guardar_oftalmologia").html(
						'<input type="hidden" id="hdd_exito" value="-1" />' +
						'<div class="contenedor_error" style="display:block;">Error - existen diagn&oacute;sticos duplicados</div>'
					);
				} else if (resultado == -3) {
					$("#guardar_oftalmologia").html(
						'<input type="hidden" id="hdd_exito" value="-1" />' +
						'<div class="contenedor_error" style="display:block;">Error - existen procedimientos duplicados</div>'
					);
				} else {
					$("#guardar_oftalmologia").html(
						'<input type="hidden" id="hdd_exito" value="-1" />' +
						'<div class="contenedor_error" style="display:block;">Los campos marcados en rojo son obligatorios</div>'
					);
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
					editar_consulta_oftalmologia(tipo, ind_imprimir);
				} else {
					$("#guardar_oftalmologia").html(
						'<input type="hidden" id="hdd_exito" value="-1" />' +
						'<div class="contenedor_error" style="display:block;">Error - existen procedimientos duplicados</div>'
					);
					window.scroll(0, 0);
				}
			} else {
				$("#guardar_oftalmologia").html(
					'<input type="hidden" id="hdd_exito" value="-1" />' +
					'<div class="contenedor_error" style="display:block;">Error - existen diagn&oacute;sticos duplicados</div>'
				);
				window.scroll(0, 0);
			}
			break;
	}
}

function imprimir_oftalmologia() {
	var params = "id_hc=" + $("#hdd_id_hc_consulta").val();
	
	llamarAjax("../historia_clinica/impresion_historia_clinica.php", params, "d_impresion_hc", "continuar_imprimir_oftalmologia();");
}

function continuar_imprimir_oftalmologia() {
	var ruta = $("#hdd_ruta_arch_hc_pdf").val();
	window.open("../funciones/abrir_pdf.php?ruta=" + ruta + "&nombre_arch=consulta_oftalmologia.pdf", "_blank");
}

/**
 * Validar los campos de oftalmologia
 */
function validar_oftalmologia() {
	$("#guardar_oftalmologia").html("");
	var result = 0;
	var panel_1 = 0;
	var panel_2 = 0;
	var panel_3 = 0;
	var panel_4 = 0;
	var panel_5 = 0;
	var panel_6 = 0;
	
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
	
	$("#cmb_antec_cx_refrac").removeClass("borde_error");
	
	$("#cke_txt_enfermedad_actual").removeClass("borde_error");
	$("#cke_txt_biomi_orbita_parpados_od").removeClass("borde_error");
	$("#cke_txt_biomi_sist_lagrimal_od").removeClass("borde_error");
	$("#cke_txt_biomi_conjuntiva_od").removeClass("borde_error");
	$("#cke_txt_biomi_cornea_od").removeClass("borde_error");
	$("#cke_txt_biomi_cam_anterior_od").removeClass("borde_error");
	$("#cke_txt_biomi_iris_od").removeClass("borde_error");
	$("#cke_txt_biomi_cristalino_od").removeClass("borde_error");
	
	$("#cke_txt_biomi_orbita_parpados_oi").removeClass("borde_error");
	$("#cke_txt_biomi_sist_lagrimal_oi").removeClass("borde_error");
	$("#cke_txt_biomi_conjuntiva_oi").removeClass("borde_error");
	$("#cke_txt_biomi_cornea_oi").removeClass("borde_error");
	$("#cke_txt_biomi_cam_anterior_oi").removeClass("borde_error");
	$("#cke_txt_biomi_iris_oi").removeClass("borde_error");
	$("#cke_txt_biomi_cristalino_oi").removeClass("borde_error");
	
	$("#cke_txt_tonometria_nervio_optico_od").removeClass("borde_error");
	$("#cke_txt_tonometria_macula_od").removeClass("borde_error");
	
	$("#cke_txt_tonometria_nervio_optico_oi").removeClass("borde_error");
	$("#cke_txt_tonometria_macula_oi").removeClass("borde_error");
	
	$("#txt_nombre_usuario_alt").removeClass("borde_error");
	$("#nombre_usuario_preconsulta").removeClass("borde_error");
	
	$("#cmb_formula_gafas").removeClass("borde_error");
	
	if ($("#cmb_antec_cx_refrac").val() == "") {
		$("#cmb_antec_cx_refrac").addClass("borde_error");
		result = 1; 
		panel_2 = 1;
	}
	
	if (CKEDITOR.instances.txt_enfermedad_actual.getData() == "") {
		$("#cke_txt_enfermedad_actual").addClass("borde_error");
		result = 1;
		panel_2 = 1;
	}
	
	//Motilidad y segmento anterior
	
	if (CKEDITOR.instances.txt_biomi_orbita_parpados_od.getData() == "") {
		$("#cke_txt_biomi_orbita_parpados_od").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_sist_lagrimal_od.getData() == "") {
		$("#cke_txt_biomi_sist_lagrimal_od").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_conjuntiva_od.getData() == "") {
		$("#cke_txt_biomi_conjuntiva_od").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_cornea_od.getData() == "") {
		$("#cke_txt_biomi_cornea_od").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_cam_anterior_od.getData() == "") {
		$("#cke_txt_biomi_cam_anterior_od").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_iris_od.getData() == "") {
		$("#cke_txt_biomi_iris_od").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_cristalino_od.getData() == "") {
		$("#cke_txt_biomi_cristalino_od").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_orbita_parpados_oi.getData() == "") {
		$("#cke_txt_biomi_orbita_parpados_oi").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_sist_lagrimal_oi.getData() == "") {
		$("#cke_txt_biomi_sist_lagrimal_oi").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_conjuntiva_oi.getData() == "") {
		$("#cke_txt_biomi_conjuntiva_oi").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_cornea_oi.getData() == "") {
		$("#cke_txt_biomi_cornea_oi").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_cam_anterior_oi.getData() == "") {
		$("#cke_txt_biomi_cam_anterior_oi").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_iris_oi.getData() == "") {
		$("#cke_txt_biomi_iris_oi").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	if (CKEDITOR.instances.txt_biomi_cristalino_oi.getData() == "") {
		$("#cke_txt_biomi_cristalino_oi").addClass("borde_error");
		result = 1;
		panel_3 = 1;
	}
	
	//Fondo de ojo
	
	if (CKEDITOR.instances.txt_tonometria_nervio_optico_od.getData() == "") {
		$("#cke_txt_tonometria_nervio_optico_od").addClass("borde_error");
		result = 1;
		panel_4 = 1;
	}
	
	if (CKEDITOR.instances.txt_tonometria_macula_od.getData() == "") {
		$("#cke_txt_tonometria_macula_od").addClass("borde_error");
		result = 1;
		panel_4 = 1;
	}
	
	if (CKEDITOR.instances.txt_tonometria_nervio_optico_oi.getData() == "") {
		$("#cke_txt_tonometria_nervio_optico_oi").addClass("borde_error");
		result = 1;
		panel_4 = 1;
	}
	
	if (CKEDITOR.instances.txt_tonometria_nervio_optico_oi.getData() == "") {
		$("#cke_txt_tonometria_nervio_optico_oi").addClass("borde_error");
		result = 1;
		panel_4 = 1;
	}
	
	if (CKEDITOR.instances.txt_tonometria_nervio_optico_oi.getData() == "") {
		$("#cke_txt_tonometria_nervio_optico_oi").addClass("borde_error");
		result = 1;
		panel_4 = 1;
	}
	
	if (CKEDITOR.instances.txt_tonometria_macula_oi.getData() == "") {
		$("#cke_txt_tonometria_macula_oi").addClass("borde_error");
		result = 1;
		panel_4 = 1;
	}

	
	
	if ($("#cmb_formula_gafas").val() == "" && $("#hdd_ind_optometria").val() == "1") {
		$("#cmb_formula_gafas").addClass("borde_error");
		result = 1;
		panel_5 = 1;
	}
	
	if ($("#hdd_usuario_anonimo").val() == "1" && $("#txt_nombre_usuario_alt").val() == ""){
		$("#txt_nombre_usuario_alt").addClass("borde_error");
		result = 1;
	}
	
	if ($("#hdd_ind_preconsulta_n").val() == "1" && $("#nombre_usuario_preconsulta").val() == "") {
		$("#nombre_usuario_preconsulta").addClass("borde_error");
		result = 1;
	}
	
	//Extensión de antecedentes
	if (!validar_antec_extension()) {
		result = 1;
		panel_2 = 1;
	}
	
	//Formulación de medicamentos
	if (!validar_formulacion_fm()) {
		result = 1;
		panel_5 = 1;
	}
	
	//Validación de diagnósticos
	var result_ciex = validar_diagnosticos_hc(1);
	if (result_ciex < 0) {
		result = result_ciex;
		panel_5 = 1;
	} else {
		//Validación de procedimientos solicitados
		var result_cups_solic = validar_hc_procedimientos_solic();
		if (result_cups_solic < 0) {
			result = result_cups_solic;
			panel_5 = 1;
		}
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
	
	return result;
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
			
		}else{	
		
			var id_paciente = $('#hdd_id_paciente_hc').val();
			var id_lugar_cita = $('#hdd_id_lugar_cita_hc').val();	
	
		}	 
		
		var id_admision = $('#hdd_id_admision').val();	
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
				 
		llamarAjax("../despacho/despacho_ajax.php", params, "guardar_oftalmologia", "imprimir_incapacidad();");	
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
	
	var params = 	"opcion=3&id_incapacidad="		+	id_incapacidad		+
					 	"&dias="					+	dias;
		
		llamarAjax("../despacho/despacho_ajax.php", params, "guardar_oftalmologia","imprimir_incapacidad_cont();");

	}else{	
	
		 swal({
				title: "Error",
				type: "error",
				text: "Error al tratar de guardar la incapacidad",
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
function editar_consulta_oftalmologia(tipo, ind_imprimir) {
	$("#btn_imprimir").attr("disabled", "disabled");
	$("#btn_crear").attr("disabled", "disabled");
	$("#btn_finalizar").attr("disabled", "disabled");
	
	//Se guardan las imágenes
	guardar_imagenes();
	
	var params = "opcion=1";
	
	//Antecedentes medicos
	var cant_antecedentes = parseInt($("#hdd_cant_antecedentes").val(), 10);
	var array_antecedentes_medicos_ids = new Array();
	var array_antecedentes_medicos_val = new Array();
	for (var i = 0; i < cant_antecedentes; i++) {
		array_antecedentes_medicos_ids.push($("#hdd_ant_med_" + i).val());
		array_antecedentes_medicos_val.push($("#chk_ant_med_" + i).is(":checked"));
	}
	
	//Extensión de antecedentes médicos
	params += obtener_parametros_antec_extension();
	
	//Para Diagnosticos
	var cant_ciex = $("#lista_tabla").val();
	params += "&cant_ciex=" + cant_ciex;
	for (i = 1; i <= cant_ciex; i++) {
	 	 var cod_ciex = $("#hdd_ciex_diagnostico_"+i).val();
	 	 var val_ojos = $("#valor_ojos_"+i).val();
	 	 if (cod_ciex != "") {
	 	 	params += "&cod_ciex_" + i + "=" + cod_ciex + "&val_ojos_" + i + "=" + val_ojos;
	 	 }
	}
	
	//Tonometria
	params += obtener_parametros_tonometria();
	
	//Solicitud de procedimientos
	params += obtener_parametros_proc_solic();
	
	//Formulación de medicamentos
	params += obtener_parametros_formulacion_fm();
	
	var hdd_id_hc_consulta = $("#hdd_id_hc_consulta").val();
	var hdd_id_admision = $("#hdd_id_admision").val();
	var hdd_id_paciente = $("#hdd_id_paciente").val();
	var enfermedad_actual = str_encode(CKEDITOR.instances.txt_enfermedad_actual.getData());
	var muscular_balance = str_encode($("#txt_muscular_balance").val());
	var muscular_motilidad = str_encode($("#txt_muscular_motilidad").val());
	var muscular_ppc = str_encode($("#txt_muscular_ppc").val());
	var id_lista_muscular_balance = str_encode($("#hdd_muscular_balance_lista").val());
	
	var biomi_orbita_parpados_od = str_encode(CKEDITOR.instances.txt_biomi_orbita_parpados_od.getData());
	var biomi_sist_lagrimal_od = str_encode(CKEDITOR.instances.txt_biomi_sist_lagrimal_od.getData());
	var biomi_conjuntiva_od = str_encode(CKEDITOR.instances.txt_biomi_conjuntiva_od.getData());
	var biomi_cornea_od = str_encode(CKEDITOR.instances.txt_biomi_cornea_od.getData());
	var biomi_cam_anterior_od = str_encode(CKEDITOR.instances.txt_biomi_cam_anterior_od.getData());
	var biomi_iris_od = str_encode(CKEDITOR.instances.txt_biomi_iris_od.getData());
	var biomi_cristalino_od = str_encode(CKEDITOR.instances.txt_biomi_cristalino_od.getData());

	var biomi_orbita_parpados_oi = str_encode(CKEDITOR.instances.txt_biomi_orbita_parpados_oi.getData());
	var biomi_sist_lagrimal_oi = str_encode(CKEDITOR.instances.txt_biomi_sist_lagrimal_oi.getData());
	var biomi_conjuntiva_oi = str_encode(CKEDITOR.instances.txt_biomi_conjuntiva_oi.getData());
	var biomi_cornea_oi = str_encode(CKEDITOR.instances.txt_biomi_cornea_oi.getData());
	var biomi_cam_anterior_oi = str_encode(CKEDITOR.instances.txt_biomi_cam_anterior_oi.getData());
	var biomi_iris_oi = str_encode(CKEDITOR.instances.txt_biomi_iris_oi.getData());
	var biomi_cristalino_oi = str_encode(CKEDITOR.instances.txt_biomi_cristalino_oi.getData());


	var biomi_vanherick_od = $("#biomi_vanherick_od").val();
	var biomi_vanherick_oi = $("#biomi_vanherick_oi").val();
	
	var id_lista_biomi_orbita_parpados_od = str_encode($("#hdd_biomi_orbita_parpados_od_lista").val());
	var id_lista_biomi_sist_lagrimal_od = str_encode($("#hdd_biomi_sist_lagrimal_od_lista").val());
	var id_lista_biomi_conjuntiva_od = str_encode($("#hdd_biomi_conjuntiva_od_lista").val());
	var id_lista_biomi_cornea_od = str_encode($("#hdd_biomi_cornea_od_lista").val());
	var id_lista_biomi_cam_anterior_od = str_encode($("#hdd_biomi_cam_anterior_od_lista").val());
	var id_lista_biomi_iris_od = str_encode($("#hdd_biomi_iris_od_lista").val());
	var id_lista_biomi_cristalino_od = str_encode($("#hdd_biomi_cristalino_od_lista").val());
	var id_lista_biomi_orbita_parpados_oi = str_encode($("#hdd_biomi_orbita_parpados_oi_lista").val());
	var id_lista_biomi_sist_lagrimal_oi = str_encode($("#hdd_biomi_sist_lagrimal_oi_lista").val());
	var id_lista_biomi_conjuntiva_oi = str_encode($("#hdd_biomi_conjuntiva_oi_lista").val());
	var id_lista_biomi_cornea_oi = str_encode($("#hdd_biomi_cornea_oi_lista").val());
	var id_lista_biomi_cam_anterior_oi = str_encode($("#hdd_biomi_cam_anterior_oi_lista").val());
	var id_lista_biomi_iris_oi = str_encode($("#hdd_biomi_iris_oi_lista").val());
	var id_lista_biomi_cristalino_oi = str_encode($("#hdd_biomi_cristalino_oi_lista").val());
	var goniosco_superior_od = $("#goniosco_superior_od").val();
	var goniosco_inferior_od = $("#goniosco_inferior_od").val();
	var goniosco_nasal_od = $("#goniosco_nasal_od").val();
	var goniosco_temporal_od = $("#goniosco_temporal_od").val();
	var goniosco_superior_oi = $("#goniosco_superior_oi").val();
	var goniosco_inferior_oi = $("#goniosco_inferior_oi").val();
	var goniosco_nasal_oi = $("#goniosco_nasal_oi").val();
	var goniosco_temporal_oi = $("#goniosco_temporal_oi").val();
	
	var tonometria_nervio_optico_od = str_encode(CKEDITOR.instances.txt_tonometria_nervio_optico_od.getData());
	var tonometria_macula_od = str_encode(CKEDITOR.instances.txt_tonometria_macula_od.getData());
	var tonometria_periferia_od = str_encode(CKEDITOR.instances.txt_tonometria_periferia_od.getData());
	var tonometria_vitreo_od = str_encode(CKEDITOR.instances.txt_tonometria_vitreo_od.getData());
	var tonometria_nervio_optico_oi = str_encode(CKEDITOR.instances.txt_tonometria_nervio_optico_oi.getData());
	var tonometria_macula_oi = str_encode(CKEDITOR.instances.txt_tonometria_macula_oi.getData());
	var tonometria_periferia_oi = str_encode(CKEDITOR.instances.txt_tonometria_periferia_oi.getData());
	var tonometria_vitreo_oi = str_encode(CKEDITOR.instances.txt_tonometria_vitreo_oi.getData());


	var id_lista_tonometria_nervio_optico_od = str_encode($("#hdd_tonometria_nervio_optico_od_lista").val());
	var id_lista_tonometria_macula_od = str_encode($("#hdd_tonometria_macula_od_lista").val());
	var id_lista_tonometria_periferia_od = str_encode($("#hdd_tonometria_periferia_od_lista").val());
	var id_lista_tonometria_vitreo_od = str_encode($("#hdd_tonometria_vitreo_od_lista").val());
	var id_lista_tonometria_nervio_optico_oi = str_encode($("#hdd_tonometria_nervio_optico_oi_lista").val());
	var id_lista_tonometria_macula_oi = str_encode($("#hdd_tonometria_macula_oi_lista").val());
	var id_lista_tonometria_periferia_oi = str_encode($("#hdd_tonometria_periferia_oi_lista").val());
	var id_lista_tonometria_vitreo_oi = str_encode($("#hdd_tonometria_vitreo_oi_lista").val());
	var diagnostico_oftalmo = str_encode(CKEDITOR.instances.txt_diagnostico_oftalmo.getData());
	var solicitud_examenes = str_encode(CKEDITOR.instances.txt_solicitud_examenes.getData());
	var tratamiento_oftalmo = str_encode(CKEDITOR.instances.txt_tratamiento_oftalmo.getData());
	var img_biomiocroscopia = str_encode($("#img_biomiocroscopia").val());
	var img_tonometria_od = str_encode($("#img_tonometria_od").val());
	var img_tonometria_oi = str_encode($("#img_tonometria_oi").val());
	var desc_antecedentes_medicos = str_encode(CKEDITOR.instances.txt_desc_antecedentes_medicos.getData());
	var ind_antec_cx_refrac = $("#cmb_antec_cx_refrac").val();
	var observaciones_gonioscopia = str_encode(CKEDITOR.instances.txt_observaciones_gonioscopia.getData());
	var medicamentos_oftalmo = str_encode($("#medicamentos_oftalmo").val());
	var nombre_usuario_alt = str_encode($("#txt_nombre_usuario_alt").val());
	var nombre_usuario_preconsulta = str_encode($("#nombre_usuario_preconsulta").val());
	var observaciones_tonometria = str_encode(CKEDITOR.instances.txt_observaciones_tonometria.getData());
	var ind_formula_gafas = $("#cmb_formula_gafas").val();
	var ind_eval_muscular = $("#chk_eval_muscular").is(":checked") ? 1 : 0;
	
	params += "&hdd_id_hc_consulta="+ hdd_id_hc_consulta +
			  "&hdd_id_admision=" + hdd_id_admision +
			  "&hdd_id_paciente=" + hdd_id_paciente + 
			  "&enfermedad_actual=" + enfermedad_actual +
			  "&array_antecedentes_medicos_ids=" + array_antecedentes_medicos_ids +
			  "&array_antecedentes_medicos_val=" + array_antecedentes_medicos_val +
			  "&muscular_balance=" + muscular_balance +
			  "&muscular_motilidad=" + muscular_motilidad +
			  "&muscular_ppc=" + muscular_ppc +
			  "&id_lista_muscular_balance=" + id_lista_muscular_balance +
			  "&biomi_orbita_parpados_od=" + biomi_orbita_parpados_od +
			  "&biomi_sist_lagrimal_od=" + biomi_sist_lagrimal_od +
			  "&biomi_conjuntiva_od=" + biomi_conjuntiva_od +
			  "&biomi_cornea_od=" + biomi_cornea_od +
			  "&biomi_cam_anterior_od=" + biomi_cam_anterior_od +
			  "&biomi_iris_od=" + biomi_iris_od +
			  "&biomi_cristalino_od=" + biomi_cristalino_od +
			  "&biomi_vanherick_od=" + biomi_vanherick_od +
			  "&biomi_orbita_parpados_oi=" + biomi_orbita_parpados_oi +
			  "&biomi_sist_lagrimal_oi=" + biomi_sist_lagrimal_oi +
			  "&biomi_conjuntiva_oi=" + biomi_conjuntiva_oi +
			  "&biomi_cornea_oi=" + biomi_cornea_oi +
			  "&biomi_cam_anterior_oi=" + biomi_cam_anterior_oi +
			  "&biomi_iris_oi=" + biomi_iris_oi +
			  "&biomi_cristalino_oi=" + biomi_cristalino_oi +
			  "&biomi_vanherick_oi=" + biomi_vanherick_oi +
			  "&id_lista_biomi_orbita_parpados_od=" + id_lista_biomi_orbita_parpados_od +
			  "&id_lista_biomi_sist_lagrimal_od=" + id_lista_biomi_sist_lagrimal_od +
			  "&id_lista_biomi_conjuntiva_od=" + id_lista_biomi_conjuntiva_od +
			  "&id_lista_biomi_cornea_od=" + id_lista_biomi_cornea_od +
			  "&id_lista_biomi_cam_anterior_od=" + id_lista_biomi_cam_anterior_od +
			  "&id_lista_biomi_iris_od=" + id_lista_biomi_iris_od +
			  "&id_lista_biomi_cristalino_od=" + id_lista_biomi_cristalino_od +
			  "&id_lista_biomi_orbita_parpados_oi=" + id_lista_biomi_orbita_parpados_oi +
			  "&id_lista_biomi_sist_lagrimal_oi=" + id_lista_biomi_sist_lagrimal_oi +
			  "&id_lista_biomi_conjuntiva_oi=" + id_lista_biomi_conjuntiva_oi +
			  "&id_lista_biomi_cornea_oi=" + id_lista_biomi_cornea_oi +
			  "&id_lista_biomi_cam_anterior_oi=" + id_lista_biomi_cam_anterior_oi +
			  "&id_lista_biomi_iris_oi=" + id_lista_biomi_iris_oi +
			  "&id_lista_biomi_cristalino_oi=" + id_lista_biomi_cristalino_oi +
			  "&goniosco_superior_od=" + goniosco_superior_od +
			  "&goniosco_inferior_od=" + goniosco_inferior_od +
			  "&goniosco_nasal_od=" + goniosco_nasal_od +
			  "&goniosco_temporal_od=" + goniosco_temporal_od +
			  "&goniosco_superior_oi=" + goniosco_superior_oi +
			  "&goniosco_inferior_oi=" + goniosco_inferior_oi +
			  "&goniosco_nasal_oi=" + goniosco_nasal_oi +
			  "&goniosco_temporal_oi=" + goniosco_temporal_oi +
			  "&tonometria_nervio_optico_od=" + tonometria_nervio_optico_od +
			  "&tonometria_macula_od=" + tonometria_macula_od +
			  "&tonometria_periferia_od=" + tonometria_periferia_od +
			  "&tonometria_vitreo_od=" + tonometria_vitreo_od +
			  "&tonometria_nervio_optico_oi=" + tonometria_nervio_optico_oi +
			  "&tonometria_macula_oi=" + tonometria_macula_oi +
			  "&tonometria_periferia_oi=" + tonometria_periferia_oi +
			  "&tonometria_vitreo_oi=" + tonometria_vitreo_oi +
			  "&id_lista_tonometria_nervio_optico_od=" + id_lista_tonometria_nervio_optico_od +
			  "&id_lista_tonometria_macula_od=" + id_lista_tonometria_macula_od +
			  "&id_lista_tonometria_periferia_od=" + id_lista_tonometria_periferia_od +
			  "&id_lista_tonometria_vitreo_od=" + id_lista_tonometria_vitreo_od +
			  "&id_lista_tonometria_nervio_optico_oi=" + id_lista_tonometria_nervio_optico_oi +
			  "&id_lista_tonometria_macula_oi=" + id_lista_tonometria_macula_oi +
			  "&id_lista_tonometria_periferia_oi=" + id_lista_tonometria_periferia_oi +
			  "&id_lista_tonometria_vitreo_oi=" + id_lista_tonometria_vitreo_oi +
			  "&diagnostico_oftalmo=" + diagnostico_oftalmo +
			  "&solicitud_examenes=" + solicitud_examenes +
			  "&tratamiento_oftalmo=" + tratamiento_oftalmo +
			  "&img_biomiocroscopia=" + img_biomiocroscopia +
			  "&img_tonometria_od=" + img_tonometria_od +
			  "&img_tonometria_oi=" + img_tonometria_oi +
			  "&tipo_guardar=" + tipo +
			  "&desc_antecedentes_medicos=" + desc_antecedentes_medicos +
			  "&ind_antec_cx_refrac=" + ind_antec_cx_refrac +
			  "&observaciones_gonioscopia=" + observaciones_gonioscopia +
			  "&medicamentos_oftalmo=" + medicamentos_oftalmo +
			  "&nombre_usuario_alt=" + str_encode(nombre_usuario_alt) +
			  "&nombre_usuario_preconsulta=" + str_encode(nombre_usuario_preconsulta) +
			  "&observaciones_tonometria=" + observaciones_tonometria +
			  "&ind_formula_gafas=" + ind_formula_gafas +
			  "&ind_eval_muscular=" + ind_eval_muscular +
			  "&cadena_colores=" + obtener_cadena_colores();
	
	//Oftalmología pediátrica
	var tipo_reg_adicional = $("#hdd_tipo_reg_adicional").val();
	params += "&tipo_reg_adicional=" + tipo_reg_adicional;
	if (tipo_reg_adicional == "1" || ind_eval_muscular == 1) {
		let txt_nistagmo = $("#txt_nistagmo").val() == undefined ? '' : $("#txt_nistagmo").val();
		params += "&metodo_ofp=" + str_encode($("#txt_metodo_ofp").val()) +
				  "&ind_ortotropia=" + $("#cmb_ortotropia").val() +
				  "&id_correccion=" + $("#cmb_correccion").val() +
				  "&id_ojo_fijador=" + $("#cmb_ojo_fijador").val() +
				  "&lejos_h=" + str_encode($("#txt_lejos_h").val()) +
				  "&lejos_h_delta=" + $("#txt_lejos_h_delta").val() +
				  "&lejos_v=" + str_encode($("#txt_lejos_v").val()) +
				  "&lejos_v_delta=" + $("#txt_lejos_v_delta").val() +
				  "&cerca_h=" + str_encode($("#txt_cerca_h").val()) +
				  "&cerca_h_delta=" + $("#txt_cerca_h_delta").val() +
				  "&cerca_v=" + str_encode($("#txt_cerca_v").val()) +
				  "&cerca_v_delta=" + $("#txt_cerca_v_delta").val() +
				  "&cerca_c_h=" + str_encode($("#txt_cerca_c_h").val()) +
				  "&cerca_c_h_delta=" + $("#txt_cerca_c_h_delta").val() +
				  "&cerca_c_v=" + str_encode($("#txt_cerca_c_v").val()) +
				  "&cerca_c_v_delta=" + $("#txt_cerca_c_v_delta").val() +
				  "&cerca_b_h=" + str_encode($("#txt_cerca_b_h").val()) +
				  "&cerca_b_h_delta=" + $("#txt_cerca_b_h_delta").val() +
				  "&cerca_b_v=" + str_encode($("#txt_cerca_b_v").val()) +
				  "&cerca_b_v_delta=" + $("#txt_cerca_b_v_delta").val() +
				  "&derecha_alto_h=" + str_encode($("#txt_derecha_alto_h").val()) +
				  "&derecha_alto_h_delta=" + $("#txt_derecha_alto_h_delta").val() +
				  "&derecha_alto_v=" + str_encode($("#txt_derecha_alto_v").val()) +
				  "&derecha_alto_v_delta=" + $("#txt_derecha_alto_v_delta").val() +
				  "&derecha_medio_h=" + str_encode($("#txt_derecha_medio_h").val()) +
				  "&derecha_medio_h_delta=" + $("#txt_derecha_medio_h_delta").val() +
				  "&derecha_medio_v=" + str_encode($("#txt_derecha_medio_v").val()) +
				  "&derecha_medio_v_delta=" + $("#txt_derecha_medio_v_delta").val() +
				  "&derecha_bajo_h=" + str_encode($("#txt_derecha_bajo_h").val()) +
				  "&derecha_bajo_h_delta=" + $("#txt_derecha_bajo_h_delta").val() +
				  "&derecha_bajo_v=" + str_encode($("#txt_derecha_bajo_v").val()) +
				  "&derecha_bajo_v_delta=" + $("#txt_derecha_bajo_v_delta").val() +
				  "&centro_alto_h=" + str_encode($("#txt_centro_alto_h").val()) +
				  "&centro_alto_h_delta=" + $("#txt_centro_alto_h_delta").val() +
				  "&centro_alto_v=" + str_encode($("#txt_centro_alto_v").val()) +
				  "&centro_alto_v_delta=" + $("#txt_centro_alto_v_delta").val() +
				  "&centro_medio_h=" + str_encode($("#txt_centro_medio_h").val()) +
				  "&centro_medio_h_delta=" + $("#txt_centro_medio_h_delta").val() +
				  "&centro_medio_v=" + str_encode($("#txt_centro_medio_v").val()) +
				  "&centro_medio_v_delta=" + $("#txt_centro_medio_v_delta").val() +
				  "&centro_bajo_h=" + str_encode($("#txt_centro_bajo_h").val()) +
				  "&centro_bajo_h_delta=" + $("#txt_centro_bajo_h_delta").val() +
				  "&centro_bajo_v=" + str_encode($("#txt_centro_bajo_v").val()) +
				  "&centro_bajo_v_delta=" + $("#txt_centro_bajo_v_delta").val() +
				  "&izquierda_alto_h=" + str_encode($("#txt_izquierda_alto_h").val()) +
				  "&izquierda_alto_h_delta=" + $("#txt_izquierda_alto_h_delta").val() +
				  "&izquierda_alto_v=" + str_encode($("#txt_izquierda_alto_v").val()) +
				  "&izquierda_alto_v_delta=" + $("#txt_izquierda_alto_v_delta").val() +
				  "&izquierda_medio_h=" + str_encode($("#txt_izquierda_medio_h").val()) +
				  "&izquierda_medio_h_delta=" + $("#txt_izquierda_medio_h_delta").val() +
				  "&izquierda_medio_v=" + str_encode($("#txt_izquierda_medio_v").val()) +
				  "&izquierda_medio_v_delta=" + $("#txt_izquierda_medio_v_delta").val() +
				  "&izquierda_bajo_h=" + str_encode($("#txt_izquierda_bajo_h").val()) +
				  "&izquierda_bajo_h_delta=" + $("#txt_izquierda_bajo_h_delta").val() +
				  "&izquierda_bajo_v=" + str_encode($("#txt_izquierda_bajo_v").val()) +
				  "&izquierda_bajo_v_delta=" + $("#txt_izquierda_bajo_v_delta").val() +
				  "&alto_derecha_od=" + str_encode($("#txt_alto_derecha_od").val()) +
				  "&alto_centro_od=" + str_encode($("#txt_alto_centro_od").val()) +
				  "&alto_izquierda_od=" + str_encode($("#txt_alto_izquierda_od").val()) +
				  "&medio_derecha_od=" + str_encode($("#txt_medio_derecha_od").val()) +
				  "&medio_izquierda_od=" + str_encode($("#txt_medio_izquierda_od").val()) +
				  "&bajo_derecha_od=" + str_encode($("#txt_bajo_derecha_od").val()) +
				  "&bajo_centro_od=" + str_encode($("#txt_bajo_centro_od").val()) +
				  "&bajo_izquierda_od=" + str_encode($("#txt_bajo_izquierda_od").val()) +
				  "&dvd_od=" + $("#txt_dvd_od").val() +
				  "&alto_derecha_oi=" + str_encode($("#txt_alto_derecha_oi").val()) +
				  "&alto_centro_oi=" + str_encode($("#txt_alto_centro_oi").val()) +
				  "&alto_izquierda_oi=" + str_encode($("#txt_alto_izquierda_oi").val()) +
				  "&medio_derecha_oi=" + str_encode($("#txt_medio_derecha_oi").val()) +
				  "&medio_izquierda_oi=" + str_encode($("#txt_medio_izquierda_oi").val()) +
				  "&bajo_derecha_oi=" + str_encode($("#txt_bajo_derecha_oi").val()) +
				  "&bajo_centro_oi=" + str_encode($("#txt_bajo_centro_oi").val()) +
				  "&bajo_izquierda_oi=" + str_encode($("#txt_bajo_izquierda_oi").val()) +
				  "&dvd_oi=" + $("#txt_dvd_oi").val() +
				  "&observaciones_oft_pediat=" + str_encode(CKEDITOR.instances.txt_observaciones_oft_pediat.getData()) +
				  "&inclinacion_der_h=" + str_encode($("#txt_inclinacion_der_h").val()) +
				  "&inclinacion_der_h_delta=" + $("#txt_inclinacion_der_h_delta").val() +
				  "&inclinacion_der_v=" + str_encode($("#txt_inclinacion_der_v").val()) +
				  "&inclinacion_der_v_delta=" + $("#txt_inclinacion_der_v_delta").val() +
				  "&inclinacion_izq_h=" + str_encode($("#txt_inclinacion_izq_h").val()) +
				  "&inclinacion_izq_h_delta=" + $("#txt_inclinacion_izq_h_delta").val() +
				  "&inclinacion_izq_v=" + str_encode($("#txt_inclinacion_izq_v").val()) +
				  "&inclinacion_izq_v_delta=" + $("#txt_inclinacion_izq_v_delta").val() +
				  "&ind_nistagmo=" + $("#cmb_nistagmo").val() +
				  "&texto_nistagmo=" + str_encode(txt_nistagmo) +
				  "&ind_pac=" + $("#cmb_pac").val() +
				  "&texto_pac=" + str_encode($("#txt_pac").val()) +
				  "&conv_fusional_lejos=" + $("#txt_conv_fusional_lejos").val() +
				  "&conv_fusional_cerca=" + $("#txt_conv_fusional_cerca").val() +
				  "&div_fusional_lejos=" + $("#txt_div_fusional_lejos").val() +
				  "&div_fusional_cerca=" + $("#txt_div_fusional_cerca").val() +
				  "&id_worth_lejos=" + $("#cmb_worth_lejos").val() +
				  "&id_worth_cerca=" + $("#cmb_worth_cerca").val() +
				  "&id_estereopsis_mosca=" + $("#cmb_estereopsis_mosca").val() +
				  "&valor_estereopsis_animales=" + $("#txt_valor_estereopsis_animales").val() +
				  "&valor_estereopsis_circulos=" + $("#txt_valor_estereopsis_circulos").val() +
				  "&id_maddox_der=" + $("#cmb_maddox_der").val() +
				  "&valor_maddox_der=" + $("#txt_valor_maddox_der").val() +
				  "&id_maddox_izq=" + $("#cmb_maddox_izq").val() +
				  "&valor_maddox_izq=" + $("#txt_valor_maddox_izq").val();
	}
	
	llamarAjax("consulta_oftalmologia_ajax.php", params, "guardar_oftalmologia", "validar_exito(" + ind_imprimir + ");");
}

function validar_exito(ind_imprimir) {
	var hdd_exito = $("#hdd_exito").val();
	var hdd_url_menu = $("#hdd_url_menu").val();
	var hdd_tipo_guardar = $("#hdd_tipo_guardar").val();
	var hdd_exito_reg_adicional = $("#hdd_exito_reg_adicional").val();
	var hdd_exito_formulacion_fm = $("#hdd_exito_formulacion_fm").val();
	var hdd_exito_hc_procedimientos_solic = $("#hdd_exito_hc_procedimientos_solic").val();
	
	if (hdd_tipo_guardar == 1 || hdd_tipo_guardar == 4) { //Cierra el formulario
		if (hdd_exito > 0 && hdd_exito_reg_adicional > 0 && hdd_exito_formulacion_fm > 0 && hdd_exito_hc_procedimientos_solic > 0) {
			$(".formulario").css("display", "none");
			$("#contenedor_exito").css("display", "block");
			$("#contenedor_exito").html("Datos guardados correctamente");
			setTimeout("enviar_credencial('" + hdd_url_menu + "')", 3000);
		} else if (hdd_exito <= 0) {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar el registro de consulta de oftalmolog&iacute;a");
		} else if (hdd_exito_reg_adicional <= 0) {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar el registro de consulta de oftalmolog&iacute;a pedi&aacute;trica");
		} else if (hdd_exito_formulacion_fm <= 0){
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la formulaci&oacute;n de medicamentos");
		} else {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la solicitud de procedimientos y ex&aacute;menes");
		}
	} else { //Permanece en el formulario
		if (hdd_exito > 0 && hdd_exito_reg_adicional > 0 && hdd_exito_formulacion_fm > 0 && hdd_exito_hc_procedimientos_solic > 0) {
			$("#contenedor_exito").css("display", "block");
			$("#contenedor_exito").html("Datos guardados correctamente");
			setTimeout('$("#contenedor_exito").css("display", "none")', 3000);
			
			if (ind_imprimir == 1) {
				imprimir_oftalmologia();
			}
		} else if (hdd_exito <= 0) {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar el registro de consulta de oftalmolog&iacute;a");
		} else if (hdd_exito_reg_adicional <= 0) {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar el registro de consulta de oftalmolog&iacute;a pedi&aacute;trica");
		} else if (hdd_exito_formulacion_fm <= 0){
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la formulaci&oacute;n de medicamentos");
		} else {
			$("#contenedor_error").css("display", "block");
			$("#contenedor_error").html("Error al guardar la solicitud de procedimientos y ex&aacute;menes");
		}
	}
	window.scrollTo(0, 0);
	$("#btn_imprimir").removeAttr("disabled");
	$("#btn_crear").removeAttr("disabled");
	$("#btn_finalizar").removeAttr("disabled");
}

function guardar_imagenes() {
	document.getElementById("ifr_img_biomicroscopia").contentWindow.guardar_imagen();
	document.getElementById("ifr_img_tonometria_od").contentWindow.guardar_imagen();
	document.getElementById("ifr_img_tonometria_oi").contentWindow.guardar_imagen();
	
}

function agregar_antecedentes(id_hc){
	var params="opcion=2&id_hc="+id_hc;
	llamarAjax("consulta_oftalmologia_ajax.php", params, "d_interno", "mostrar_formulario_flotante(1); reducir_formulario_flotante(600, 300);");
}

function agregar_antecedentes_medicos(id_hc) {
	var params = "opcion=3&id_hc=" + id_hc;
	
	//Antecedentes medicos
	var array_antecedentes_medicos_ids = new Array();
	var array_antecedentes_medicos_val = new Array();
	$("input[name='check_medicos_otros']:checked").each(function() {	
	   var checkbox = $(this);
	   array_antecedentes_medicos_ids.push(checkbox.val());
	   array_antecedentes_medicos_val.push(checkbox.is(":checked"));
	});
	
	params += "&array_antecedentes_medicos_ids=" + array_antecedentes_medicos_ids +
			  "&array_antecedentes_medicos_val=" + array_antecedentes_medicos_val;
	
	llamarAjax("consulta_oftalmologia_ajax.php", params, "otros_antecedentes_medicos", "mostrar_formulario_flotante(0); validar_check_ant_medicos();");
	
}

function agregar_antecedentes_otros(id_hc){
	var params = "opcion=4&id_hc=" + id_hc;
	llamarAjax("consulta_oftalmologia_ajax.php", params, "d_interno", "mostrar_formulario_flotante(1); reducir_formulario_flotante(600, 300);");
}

function agregar_otros_antecedentes_otros(id_hc){
	var antecedentes_otros_oculto = $("#antecedentes_otros_oculto").val();
	var antecedentes_otros = $("#antecedentes_otros").val();
	
	var params = "opcion=5&id_hc=" + id_hc;
	
	//Antecedentes medicos
	var array_antecedentes_otros_ids = new Array();
	var array_antecedentes_otros_val = new Array();
	var text_antecedentes_otros_ids = "";
	$("input[name='check_otros_']:checked").each(function() {	
	   var checkbox = $(this);
	   text_antecedentes_otros_ids = text_antecedentes_otros_ids + "-" + checkbox.val();
	   array_antecedentes_otros_ids.push(checkbox.val());
	   array_antecedentes_otros_val.push(checkbox.is(":checked"));
	});
	
	if (text_antecedentes_otros_ids == "") {
		$("#antecedentes_otros").val(antecedentes_otros_oculto);
	} else {
		$("#antecedentes_otros").val($("#antecedentes_otros").val() + text_antecedentes_otros_ids);	  	
	}
	
	params += "&array_antecedentes_otros_ids=" + array_antecedentes_otros_ids +
			  "&array_antecedentes_otros_val=" + array_antecedentes_otros_val;
	
	llamarAjax("consulta_oftalmologia_ajax.php", params, "otros_antecedentes_otros", "mostrar_formulario_flotante(0);");
}

function marcar_sano_oft(id_campo, ind_iris) {
	if (ind_iris == 1) {
		$("#" + id_campo).val("Marr\u00F3n PNCR");
	} else {
		$("#" + id_campo).val("Normal");
	}
	$("#" + id_campo).trigger("input");
}

function marcar_sano_oft_todos(tipo) {
	switch (tipo) {
		case 1: //Biomicroscopia
			if (CKEDITOR.instances.txt_biomi_conjuntiva_od.getData() == "") {
				marcar_sano_rec_oft("biomi_conjuntiva", "_od", "");
			}
			if (CKEDITOR.instances.txt_biomi_conjuntiva_oi.getData() == "") {
				marcar_sano_rec_oft("biomi_conjuntiva", "_oi", "");
			}
			if (CKEDITOR.instances.txt_biomi_cornea_od.getData() == "") {
				marcar_sano_rec_oft("biomi_cornea", "_od", "");
			}
			if (CKEDITOR.instances.txt_biomi_cornea_oi.getData() == "") {
				marcar_sano_rec_oft("biomi_cornea", "_oi", "");
			}
			if (CKEDITOR.instances.txt_biomi_cam_anterior_od.getData() == "") {
				marcar_sano_rec_oft("biomi_cam_anterior", "_od", "");
			}
			if (CKEDITOR.instances.txt_biomi_cam_anterior_oi.getData() == "") {
				marcar_sano_rec_oft("biomi_cam_anterior", "_oi", "");
			}
			if (CKEDITOR.instances.txt_biomi_iris_od.getData() == "") {
				marcar_sano_rec_oft("biomi_iris", "_od", "");
			}
			if (CKEDITOR.instances.txt_biomi_iris_oi.getData() == "") {
				marcar_sano_rec_oft("biomi_iris", "_oi", "");
			}
			if (CKEDITOR.instances.txt_biomi_cristalino_od.getData() == "") {
				marcar_sano_rec_oft("biomi_cristalino", "_od", "");
			}
			if (CKEDITOR.instances.txt_biomi_cristalino_oi.getData() == "") {
				marcar_sano_rec_oft("biomi_cristalino", "_oi", "");
			}
			break;
			
		case 2: //Fondo de ojo
			if (CKEDITOR.instances.txt_tonometria_nervio_optico_od.getData() == "") {
				marcar_sano_rec_oft("tonometria_nervio_optico", "_od", "");
			}
			if (CKEDITOR.instances.txt_tonometria_nervio_optico_oi.getData() == "") {
				marcar_sano_rec_oft("tonometria_nervio_optico", "_oi", "");
			}
			if (CKEDITOR.instances.txt_tonometria_macula_od.getData() == "") {
				marcar_sano_rec_oft("tonometria_macula", "_od", "");
			}
			if (CKEDITOR.instances.txt_tonometria_macula_oi.getData() == "") {
				marcar_sano_rec_oft("tonometria_macula", "_oi", "");
			}
			if (CKEDITOR.instances.txt_tonometria_periferia_od.getData() == "") {
				marcar_sano_rec_oft("tonometria_periferia", "_od", "");
			}
			if (CKEDITOR.instances.txt_tonometria_periferia_oi.getData() == "") {
				marcar_sano_rec_oft("tonometria_periferia", "_oi", "");
			}
			if (CKEDITOR.instances.txt_tonometria_vitreo_od.getData() == "") {
				marcar_sano_rec_oft("tonometria_vitreo", "_od", "");
			}
			if (CKEDITOR.instances.txt_tonometria_vitreo_oi.getData() == "") {
				marcar_sano_rec_oft("tonometria_vitreo", "_oi", "");
			}
			break;
			
		case 3: //Anexos oculares
		
			if (CKEDITOR.instances.txt_biomi_orbita_parpados_od.getData() == "") {
				marcar_sano_rec_oft("biomi_orbita_parpados", "_od", "");
			}
			if (CKEDITOR.instances.txt_biomi_orbita_parpados_oi.getData() == "") {
				marcar_sano_rec_oft("biomi_orbita_parpados", "_oi", "");
			}
			if (CKEDITOR.instances.txt_biomi_sist_lagrimal_od.getData() == "") {
				marcar_sano_rec_oft("biomi_sist_lagrimal", "_od", "");
			}
			if (CKEDITOR.instances.txt_biomi_sist_lagrimal_oi.getData() == "") {
				marcar_sano_rec_oft("biomi_sist_lagrimal", "_oi", "");
			}
			break;
	}
}

function marcar_nopresenta_oft(id_campo) {
	$("#" + id_campo).val("No Presenta");
}

function copiar_campo(id_campo_origen, id_campo_destino) {
	var campo_origen = $("#" + id_campo_origen).val();
	$("#" + id_campo_destino).val(campo_origen);
	$("#" + id_campo_destino).trigger("input");
}

function enviar_a_estados() {
	crear_oftalmologia(2, 0);
	
	var params = "opcion=6&id_hc=" + $("#hdd_id_hc_consulta").val() +
				 "&id_admision=" + $("#hdd_id_admision").val() +
				 "&ind_preconsulta=" + $("#hdd_ind_preconsulta").val();
	
	llamarAjax("consulta_oftalmologia_ajax.php", params, "d_interno", "mostrar_formulario_flotante(1);");
}

function validar_check_ant_medicos() {
	var bol_checked = false;
	$("input[name='check_medicos']").each(function() {
		var checkbox = $(this);
		if (checkbox.is(":checked")) {
			bol_checked = true;
		}
	});
	
	if (bol_checked) {
		$("#tbl_desc_antecedentes_medicos").css("display", "table");
	} else {
		$("#tbl_desc_antecedentes_medicos").css("display", "none");
	}
}

function ocultar_panels_oftalmologia() {
	//Corrige problema de pick de color para editor de imágenes
	$("#panel2-3").removeClass("active");
	$("#panel2-4").removeClass("active");
}

/*
 * Tipo
 * 1: Arriba - abajo
 * 2: Izquierda - derecha
 * 3: Todas las direcciones
 */
function copiar_ofp(tipo) {
	switch (tipo) {
		case 1: //Arriba - abajo
			$("#txt_centro_alto_h").val($("#txt_centro_medio_h").val());
			$("#txt_centro_alto_h_delta").val($("#txt_centro_medio_h_delta").val());
			$("#txt_centro_alto_v").val($("#txt_centro_medio_v").val());
			$("#txt_centro_alto_v_delta").val($("#txt_centro_medio_v_delta").val());
			
			$("#txt_centro_bajo_h").val($("#txt_centro_medio_h").val());
			$("#txt_centro_bajo_h_delta").val($("#txt_centro_medio_h_delta").val());
			$("#txt_centro_bajo_v").val($("#txt_centro_medio_v").val());
			$("#txt_centro_bajo_v_delta").val($("#txt_centro_medio_v_delta").val());
			break;
			
		case 2: //Izquierda - derecha
			$("#txt_derecha_medio_h").val($("#txt_centro_medio_h").val());
			$("#txt_derecha_medio_h_delta").val($("#txt_centro_medio_h_delta").val());
			$("#txt_derecha_medio_v").val($("#txt_centro_medio_v").val());
			$("#txt_derecha_medio_v_delta").val($("#txt_centro_medio_v_delta").val());
			
			$("#txt_izquierda_medio_h").val($("#txt_centro_medio_h").val());
			$("#txt_izquierda_medio_h_delta").val($("#txt_centro_medio_h_delta").val());
			$("#txt_izquierda_medio_v").val($("#txt_centro_medio_v").val());
			$("#txt_izquierda_medio_v_delta").val($("#txt_centro_medio_v_delta").val());
			break;
			
		case 3: //Todas las direcciones
			$("#txt_centro_alto_h").val($("#txt_centro_medio_h").val());
			$("#txt_centro_alto_h_delta").val($("#txt_centro_medio_h_delta").val());
			$("#txt_centro_alto_v").val($("#txt_centro_medio_v").val());
			$("#txt_centro_alto_v_delta").val($("#txt_centro_medio_v_delta").val());
			
			$("#txt_centro_bajo_h").val($("#txt_centro_medio_h").val());
			$("#txt_centro_bajo_h_delta").val($("#txt_centro_medio_h_delta").val());
			$("#txt_centro_bajo_v").val($("#txt_centro_medio_v").val());
			$("#txt_centro_bajo_v_delta").val($("#txt_centro_medio_v_delta").val());
			
			$("#txt_derecha_medio_h").val($("#txt_centro_medio_h").val());
			$("#txt_derecha_medio_h_delta").val($("#txt_centro_medio_h_delta").val());
			$("#txt_derecha_medio_v").val($("#txt_centro_medio_v").val());
			$("#txt_derecha_medio_v_delta").val($("#txt_centro_medio_v_delta").val());
			
			$("#txt_izquierda_medio_h").val($("#txt_centro_medio_h").val());
			$("#txt_izquierda_medio_h_delta").val($("#txt_centro_medio_h_delta").val());
			$("#txt_izquierda_medio_v").val($("#txt_centro_medio_v").val());
			$("#txt_izquierda_medio_v_delta").val($("#txt_centro_medio_v_delta").val());
			break;
	}
}

function seleccionar_nistagmo(ind_nistagmo) {
	if (ind_nistagmo == "1") {
		$("#txt_nistagmo").removeAttr("disabled");
	} else {
		$("#txt_nistagmo").val("");
		$("#txt_nistagmo").attr("disabled", "disabled");
	}
}

function seleccionar_pac(ind_pac) {
	if (ind_pac == "1") {
		$("#txt_pac").removeAttr("disabled");
	} else {
		$("#txt_pac").val("");
		$("#txt_pac").attr("disabled", "disabled");
	}
}

function seleccionar_eval_muscular() {
	if ($("#chk_eval_muscular").is(":checked")) {
		$("#panel_oft_6").css("display", "block");
	} else {
		$("#panel_oft_6").css("display", "none");
	}
}

function ajustar_div_optometria() {
	$("#div_consulta_optometria").height($("#HcFrame").contents().height() + 100);
}
