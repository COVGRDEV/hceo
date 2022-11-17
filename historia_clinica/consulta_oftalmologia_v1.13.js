/***********************************************/
/*Configuración del editor de texto enriquecido*/
/***********************************************/

if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
	CKEDITOR.tools.enableHtml5Elements(document);
}

CKEDITOR.config.width = 'auto';
CKEDITOR.config.height = 55;

var initCKEditorOftalmo = (function(id_obj) {
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
	
	for (var i in CKEDITOR.instances) {
		(function(i){
			CKEDITOR.instances[i].setData(CKEDITOR.instances[i].getData());
		})(i);
	}
}

//Imagen Muscular
var imagen_muscular = imagen_muscular || {};
imagen_muscular.GuardandoPNGs = (function() {
	var mousePressed = false;
	var lastX, lastY;
	var ctx;
	var ind_modificado = 0;
	
	function get_modificado() {
		return ind_modificado;
	}
	
	function init_muscular() {  
		// init canvas
		var canvas = document.getElementById('canvas_biomiocroscopia');
		ctx = canvas.getContext('2d');
		resetCanvasMuscular();
		
		// button events
		document.getElementById('btn_save_muscular').onmouseup = sendToServerMuscular;
		document.getElementById('btn_clear_muscular').onmouseup = resetCanvasMuscular;
		
		// canvas events
		canvas.onmousedown = function(e) {
			draw(e.layerX, e.layerY);
			mousePressed = true;
		};
		
		canvas.onmousemove = function(e) {
			if (mousePressed) {
				draw(e.layerX, e.layerY);
			}
		};
		
		canvas.onmouseup = function(e) {
			mousePressed = false;
		};
		
		canvas.onmouseleave = function(e) {
			mousePressed = false;
		};
	}
	
	function draw(x, y) {
		if (mousePressed) {
			ctx.beginPath();
			ctx.strokeStyle = document.getElementById('color_muscular').value;
			if (document.getElementById('color_muscular').value == '#ffffff' || document.getElementById('color_muscular').value == '#FFFFFF' ) {
				ctx.lineWidth = 10;   	
			} else {
				ctx.lineWidth = 2;	
			}
			ctx.lineJoin = 'round';
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(x, y);
			ctx.closePath();
			ctx.stroke();
			ind_modificado = 1;
		}
		lastX = x;
		lastY = y;
	}
	
	function sendToServerMuscular() {
		var canvas = document.getElementById('canvas_biomiocroscopia');
		var id_hc = document.getElementById('hdd_id_hc_consulta').value;
		var id_paciente = document.getElementById('hdd_id_paciente').value;
		
		var img = new Image();
		//indico la URL de la imagen
		img.src = '../imagenes/ojos_oftalmologia.png';
		//defino el evento onload del objeto imagen
		//incluyo la imagen en el canvas
		ctx.drawImage(img, 1, 1);
		
		var data = 'biomiocroscopia|' + id_paciente + '|' + id_hc + '|' + canvas.toDataURL('../imagenes/hc_temporal');
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			// request complete
			if (xhr.readyState == 4) {
				//alert('Imagen guardada correctamente');
				document.getElementById('img_biomiocroscopia').value = xhr.responseText;
			}
		}
		xhr.open('POST','../historia_clinica/guardar_img_oftalmologia.php',true);
		xhr.setRequestHeader('Content-Type', 'application/upload');
		xhr.send(data);
	}
	
	function resetCanvasMuscular() {
		var canvas = document.getElementById('canvas_biomiocroscopia');
		ctx = canvas.getContext('2d');
		// just repaint canvas white
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		var img = new Image();
		//indico la URL de la imagen
		var img_muscular_bd = document.getElementById('img_biomiocroscopia').value;
		if (img_muscular_bd == '') {
			img.src = '../imagenes/ojos_oftalmologia.png';	
		} else {
			img.src = img_muscular_bd;
		}
		
		//Se calcula la posición con respecto al canvas que tendrá la imagen de fondo
		var ancho_canvas = parseInt($("#hdd_ancho_canvas_biom").val(), 10);
		var alto_canvas = parseInt($("#hdd_alto_canvas_biom").val(), 10);
		var ancho_img = parseInt($("#hdd_ancho_img_biom").val(), 10);
		var alto_img = parseInt($("#hdd_alto_img_biom").val(), 10);
		
		var x_aux = Math.round((ancho_canvas - ancho_img) / 2);
		var y_aux = Math.round((alto_canvas - alto_img) / 2);
		
		//Se incluye la imagen en el canvas
		ctx.drawImage(img, x_aux, y_aux);
	}
	
	return {
		'init_muscular': init_muscular,
		'resetCanvasMuscular': resetCanvasMuscular,
		'sendToServerMuscular': sendToServerMuscular,
		'get_modificado': get_modificado
	};
});

//Imagen Tonometria OD
var imagen_tonometria_od = imagen_tonometria_od || {};
imagen_tonometria_od.GuardandoPNGs = (function() {
	var mousePressed = false;
	var lastX, lastY;
	var ctx;
	var ind_modificado = 0;
	
	function get_modificado() {
		return ind_modificado;
	}
	
	function init_tonometria_od() {  
		// init canvas
		//alert(document.getElementById('canvas_tonometria_od'));
		var canvas_tonometria_od = document.getElementById('canvas_tonometria_od');
		ctx = canvas_tonometria_od.getContext('2d');
		resetCanvasTonometria_od();	
		
		// button events
		document.getElementById('btn_save_tonometria_od').onmouseup = sendToServerTonometria_od;
		document.getElementById('btn_clear_tonometria_od').onmouseup = resetCanvasTonometria_od;
		
		// canvas events
		canvas_tonometria_od.onmousedown = function(e) {
			draw(e.layerX, e.layerY);
			mousePressed = true;
		};
		
		canvas_tonometria_od.onmousemove = function(e) {
			if (mousePressed) {
				draw(e.layerX, e.layerY);
			}
		};
		
		canvas_tonometria_od.onmouseup = function(e) {
			mousePressed = false;
		};
		
		canvas_tonometria_od.onmouseleave = function(e) {
			mousePressed = false;
		};
	}
	
	function draw(x, y) {
		if (mousePressed) {
			ctx.beginPath();
			ctx.strokeStyle = document.getElementById('color_tonometria_od').value;
			if (document.getElementById('color_tonometria_od').value == '#ffffff' || document.getElementById('color_tonometria_od').value == '#FFFFFF') {
				ctx.lineWidth = 10;   	
			} else {
				ctx.lineWidth = 2;	
			}
			ctx.lineJoin = 'round';
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(x, y);
			ctx.closePath();
			ctx.stroke();
			ind_modificado = 1;
		}
		lastX = x;
		lastY = y;
	}
	
	function sendToServerTonometria_od() {
		var canvas_tonometria_od = document.getElementById('canvas_tonometria_od');
		var id_hc = document.getElementById('hdd_id_hc_consulta').value;
		var id_paciente = document.getElementById('hdd_id_paciente').value;
		
		var img = new Image();
		//indico la URL de la imagen
		img.src = '../imagenes/ojos_tonometria_od.png';
		//defino el evento onload del objeto imagen
		//incluyo la imagen en el canvas
		ctx.drawImage(img, 1, 1);
		
		var data = 'tonometriaod|' + id_paciente + '|' + id_hc + '|' + canvas_tonometria_od.toDataURL('../imagenes/hc_temporal');
		
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			// request complete
			if (xhr.readyState == 4) {
				//alert('Imagen guardada correctamente');
				document.getElementById('img_tonometria_od').value = xhr.responseText;
			}
		}
		xhr.open('POST','../historia_clinica/guardar_img_oftalmologia.php',true);
		xhr.setRequestHeader('Content-Type', 'application/upload');
		xhr.send(data);
	}
	
	function resetCanvasTonometria_od() {
		var canvas_tonometria_od = document.getElementById('canvas_tonometria_od');
		ctx = canvas_tonometria_od.getContext('2d');
		// just repaint canvas white
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas_tonometria_od.width, canvas_tonometria_od.height);
		
		var img = new Image();
		//indico la URL de la imagen
		var img_tonometria_od_bd = document.getElementById('img_tonometria_od').value;
		
		if (img_tonometria_od_bd == '') {
			img.src = '../imagenes/ojos_tonometria_od.png';	
		} else {
			img.src = img_tonometria_od_bd;
		}
		//defino el evento onload del objeto imagen
		//incluyo la imagen en el canvas
		ctx.drawImage(img, 1, 1);
	}
	
	return {
    	'init_tonometria_od': init_tonometria_od,
    	'resetCanvasTonometria_od': resetCanvasTonometria_od,
		'sendToServerTonometria_od': sendToServerTonometria_od,
		'get_modificado': get_modificado
	};
});

//Imagen Tonometria OI
var imagen_tonometria_oi = imagen_tonometria_oi || {};
imagen_tonometria_oi.GuardandoPNGs = (function() {
	var mousePressed = false;
	var lastX, lastY;
	var ctx;
	var ind_modificado = 0;
	
	function get_modificado() {
		return ind_modificado;
	}
	
	function init_tonometria_oi() {  
		// init canvas
		var canvas_tonometria_oi = document.getElementById('canvas_tonometria_oi');
		ctx = canvas_tonometria_oi.getContext('2d');
		resetCanvasTonometria_oi();	
		
		// button events
		document.getElementById('btn_save_tonometria_oi').onmouseup = sendToServerTonometria_oi;
		document.getElementById('btn_clear_tonometria_oi').onmouseup = resetCanvasTonometria_oi;
		
		// canvas events
		canvas_tonometria_oi.onmousedown = function(e) {
			draw(e.layerX, e.layerY);
			mousePressed = true;
		};
		
		canvas_tonometria_oi.onmousemove = function(e) {
			if (mousePressed) {
				draw(e.layerX, e.layerY);
			}
		};
		
		canvas_tonometria_oi.onmouseup = function(e) {
			mousePressed = false;
		};
		
		canvas_tonometria_oi.onmouseleave = function(e) {
			mousePressed = false;
		};
	}
	
	function draw(x, y) {
		if (mousePressed) {
			ctx.beginPath();
			ctx.strokeStyle = document.getElementById('color_tonometria_oi').value;
			if(document.getElementById('color_tonometria_oi').value == '#ffffff' || document.getElementById('color_tonometria_oi').value == '#FFFFFF' ){
				ctx.lineWidth = 10;   	
			} else {
				ctx.lineWidth = 2;	
			}
			ctx.lineJoin = 'round';
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(x, y);
			ctx.closePath();
			ctx.stroke();
			ind_modificado = 1;
		}
		lastX = x;
		lastY = y;
	}
	
	function sendToServerTonometria_oi() {
		var canvas_tonometria_oi = document.getElementById('canvas_tonometria_oi');
		var id_hc = document.getElementById('hdd_id_hc_consulta').value;
		var id_paciente = document.getElementById('hdd_id_paciente').value;
		
		var img = new Image();
		//indico la URL de la imagen
		img.src = '../imagenes/ojos_tonometria_oi.png';
		//defino el evento onload del objeto imagen
		//incluyo la imagen en el canvas
		ctx.drawImage(img, 1, 1);
		
		var data = 'tonometriaoi|'+id_paciente+'|'+id_hc+'|'+canvas_tonometria_oi.toDataURL('../imagenes/hc_temporal');
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			// request complete
			if (xhr.readyState == 4) {
				//alert('Imagen guardada correctamente');
				document.getElementById('img_tonometria_oi').value = xhr.responseText;	    
			}
		}
		xhr.open('POST','../historia_clinica/guardar_img_oftalmologia.php',true);
		xhr.setRequestHeader('Content-Type', 'application/upload');
		xhr.send(data);
	}
	
	function resetCanvasTonometria_oi() {
		var canvas_tonometria_oi = document.getElementById('canvas_tonometria_oi');
		ctx = canvas_tonometria_oi.getContext('2d');
		// just repaint canvas white
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas_tonometria_oi.width, canvas_tonometria_oi.height);
		
		var img = new Image();
		//indico la URL de la imagen
		var img_tonometria_oi_bd = document.getElementById('img_tonometria_oi').value;
		
		if(img_tonometria_oi_bd == ''){
			img.src = '../imagenes/ojos_tonometria_oi.png';	
		} else {
			img.src = img_tonometria_oi_bd;
		}
		//defino el evento onload del objeto imagen
		//incluyo la imagen en el canvas
		ctx.drawImage(img, 1, 1);
	}
	
	return {
		'init_tonometria_oi': init_tonometria_oi,
		'resetCanvasTonometria_oi': resetCanvasTonometria_oi,
		'sendToServerTonometria_oi': sendToServerTonometria_oi,
		'get_modificado': get_modificado
	};
});

var obj_imagen_muscular;
var obj_imagen_tonometria_od;
var obj_imagen_tonometria_oi;
window.onload = function() {
	obj_imagen_muscular = new imagen_muscular.GuardandoPNGs();
	obj_imagen_muscular.init_muscular();
	obj_imagen_tonometria_od = new imagen_tonometria_od.GuardandoPNGs();
	obj_imagen_tonometria_od.init_tonometria_od();
	obj_imagen_tonometria_oi = new imagen_tonometria_oi.GuardandoPNGs();
	obj_imagen_tonometria_oi.init_tonometria_oi();
};

function borrar_img_muscular(){
	document.getElementById('color_muscular').value = '#FFFFFF';
}

function borrar_img_tonometria_od(){
	document.getElementById('color_tonometria_od').value = '#FFFFFF';
}

function borrar_img_tonometria_oi(){
	document.getElementById('color_tonometria_oi').value = '#FFFFFF';
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
			$("#contenedor_error").css("display", "none");
			if (validar_oftalmologia() == 0) {
				editar_consulta_oftalmologia(tipo);
			} else {
				$("#guardar_oftalmologia").html(
					'<input type="hidden" id="hdd_exito" value="-1" />' +
					'<div class="contenedor_error" style="display:block;">Los campos marcados en rojo son obligatorios</div>'
				);
				window.scroll(0, 0);
			}
			break;
			
		case 2: //Guardar cambios
			editar_consulta_oftalmologia(tipo);
			break;
	}
	
	if (ind_imprimir == 1) {
		setTimeout("imprimir_oftalmologia()", 1000);
	}
}

function imprimir_oftalmologia() {
	var params = "id_hc=" + $("#hdd_id_hc_consulta").val();
	
	llamarAjax("../historia_clinica/impresion_historia_clinica.php", params, "d_impresion_hc", "imprSelec(\"d_impresion_hc\")");
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
	
	$("#cke_txt_enfermedad_actual").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_orbita_parpados_od").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_sist_lagrimal_od").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_conjuntiva_od").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_cornea_od").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_cam_anterior_od").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_iris_od").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_cristalino_od").css({"border": "1px solid rgba(0,0,0,.2)"});
	
	$("#biomi_orbita_parpados_oi").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_sist_lagrimal_oi").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_conjuntiva_oi").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_cornea_oi").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_cam_anterior_oi").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_iris_oi").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#biomi_cristalino_oi").css({"border": "1px solid rgba(0,0,0,.2)"});
	
	$("#tonometria_nervio_optico_od").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#tonometria_macula_od").css({"border": "1px solid rgba(0,0,0,.2)"});
	
	$("#tonometria_nervio_optico_oi").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#tonometria_macula_oi").css({"border": "1px solid rgba(0,0,0,.2)"});
	
	$("#nombre_medico_preconsulta").css({"border": "1px solid rgba(0,0,0,.2)"});
	
	//**Para diagnosticos pintar normal
	$("#ciex_diagnostico_1").css({"border": "1px solid rgba(0,0,0,.2)"});
	$("#valor_ojos_1").css({"border": "1px solid rgba(0,0,0,.2)"});
	var cant_ciex = $('#lista_tabla').val()
	for (i = 1; i <= cant_ciex; i++) {
	 	 var cod_ciex = $("#hdd_ciex_diagnostico_"+i).val();
	 	 var val_ojos = $("#valor_ojos_"+i).val();
	 	 $("#valor_ojos_"+i).css({"border": "1px solid rgba(0,0,0,.2)"});
	}
	
	//Para diagnosticos pintar error
	if($('#hdd_ciex_diagnostico_1').val()==''){
		$("#ciex_diagnostico_1").css({"border": "2px solid #FF002A"});
		result=1;
		panel_5=1;
	}
	if($('#valor_ojos_1').val()==''){
		$("#valor_ojos_1").css({"border": "2px solid #FF002A"});
		result=1;
		panel_5=1;
	}
	var cant_ciex = $('#lista_tabla').val()
	for (i=1;i<=cant_ciex;i++) {
	 	 var cod_ciex = $("#hdd_ciex_diagnostico_"+i).val();
	 	 var val_ojos = $("#valor_ojos_"+i).val();
	 	 if(cod_ciex!='' && val_ojos==''){
	 	 	$("#valor_ojos_"+i).css({"border": "2px solid #FF002A"});
	 	 	result=1;
	 	 	panel_5=1;
	 	 }
	}
	
	if (CKEDITOR.instances.txt_enfermedad_actual.getData() == "") {
		$("#cke_txt_enfermedad_actual").css({"border": "2px solid #FF002A"});
		result=1;
		panel_2=1;
	}
	if($('#biomi_orbita_parpados_od').val()==''){
		$("#biomi_orbita_parpados_od").css({"border": "2px solid #FF002A"});
		result=1; 
		panel_3=1;
	}
	if($('#biomi_sist_lagrimal_od').val()==''){
		$("#biomi_sist_lagrimal_od").css({"border": "2px solid #FF002A"});
		result=1; 
		panel_3=1;
	}
	if($('#biomi_conjuntiva_od').val()==''){
		$("#biomi_conjuntiva_od").css({"border": "2px solid #FF002A"});
		result=1; 
		panel_3=1;
	}
	if($('#biomi_cornea_od').val()==''){
		$("#biomi_cornea_od").css({"border": "2px solid #FF002A"});
		result=1;
		panel_3=1;
	}
	if($('#biomi_cam_anterior_od').val()==''){
		$("#biomi_cam_anterior_od").css({"border": "2px solid #FF002A"});
		result=1;
		panel_3=1;
	}
	if($('#biomi_iris_od').val()==''){
		$("#biomi_iris_od").css({"border": "2px solid #FF002A"});
		result=1;
		panel_3=1;
	}
	if($('#biomi_cristalino_od').val()==''){
		$("#biomi_cristalino_od").css({"border": "2px solid #FF002A"});
		result=1;
		panel_3=1; 
	}
	
	if($('#biomi_orbita_parpados_oi').val()==''){
		$("#biomi_orbita_parpados_oi").css({"border": "2px solid #FF002A"});
		result=1;
		panel_3=1;
	}
	if($('#biomi_sist_lagrimal_oi').val()==''){
		$("#biomi_sist_lagrimal_oi").css({"border": "2px solid #FF002A"});
		result=1;
		panel_3=1;
	}
	if($('#biomi_conjuntiva_oi').val()==''){
		$("#biomi_conjuntiva_oi").css({"border": "2px solid #FF002A"});
		result=1;
		panel_3=1;
	}
	if($('#biomi_cornea_oi').val()==''){
		$("#biomi_cornea_oi").css({"border": "2px solid #FF002A"});
		result=1;
		panel_3=1;
	}
	if($('#biomi_cam_anterior_oi').val()==''){
		$("#biomi_cam_anterior_oi").css({"border": "2px solid #FF002A"});
		result=1;
		panel_3=1;
	}
	if($('#biomi_iris_oi').val()==''){
		$("#biomi_iris_oi").css({"border": "2px solid #FF002A"});
		result=1;
		panel_3=1;
	}
	if($('#biomi_cristalino_oi').val()==''){
		$("#biomi_cristalino_oi").css({"border": "2px solid #FF002A"});
		result=1;
		panel_3=1;
	}
	
	if($('#tonometria_nervio_optico_od').val()==''){
		$("#tonometria_nervio_optico_od").css({"border": "2px solid #FF002A"});
		result=1;
		panel_4=1;
	}
	if($('#tonometria_macula_od').val()==''){
		$("#tonometria_macula_od").css({"border": "2px solid #FF002A"});
		result=1;
		panel_4=1;
	}
	
	if($('#tonometria_nervio_optico_oi').val()==''){
		$("#tonometria_nervio_optico_oi").css({"border": "2px solid #FF002A"});
		result=1;
		panel_4=1;
	}
	if($('#tonometria_macula_oi').val()==''){
		$("#tonometria_macula_oi").css({"border": "2px solid #FF002A"});
		result=1;
		panel_4=1;
	}
	
	if($('#nombre_medico_preconsulta').val()==''){
		$("#nombre_medico_preconsulta").css({"border": "2px solid #FF002A"});
		result=1;
	}
	
	if(panel_1 == 1){
	   $("#panel_oft_1").addClass("borde_error_panel");
	   $("#panel_oft_1 a").css({"color": "#FF002A"});
	}
	if(panel_2 == 1){
	   $("#panel_oft_2").addClass("borde_error_panel");
	   $("#panel_oft_2 a").css({"color": "#FF002A"});
	}
	if(panel_3 == 1){
	   $("#panel_oft_3").addClass("borde_error_panel");
	   $("#panel_oft_3 a").css({"color": "#FF002A"});
	}
	if(panel_4 == 1){
	   $("#panel_oft_4").addClass("borde_error_panel");
	   $("#panel_oft_4 a").css({"color": "#FF002A"});
	}
	if(panel_5 == 1){
	   $("#panel_oft_5").addClass("borde_error_panel");
	   $("#panel_oft_5 a").css({"color": "#FF002A"});
	}
	
	return result;
}

/**
 *tipo:
 * 1=Guardar y cambiar de estado la consulta
 * 2=Guardar y NO cambiar el estado de la consulta 
 */
function editar_consulta_oftalmologia(tipo) {
	//Se guardan las imágenes
	guardar_imagenes();
	
	var params = 'opcion=1';
	
	//Antecedentes medicos
	var cant_antecedentes = parseInt($("#hdd_cant_antecedentes").val(), 10);
	var array_antecedentes_medicos_ids = new Array();
	var array_antecedentes_medicos_val = new Array();
	for (var i = 0; i < cant_antecedentes; i++) {
		array_antecedentes_medicos_ids.push($("#hdd_ant_med_" + i).val());
		array_antecedentes_medicos_val.push($("#chk_ant_med_" + i).is(":checked"));
	}
	
	//Para Diagnosticos
	var cant_ciex = $('#lista_tabla').val();
	params += '&cant_ciex=' + cant_ciex;
	for (i = 1; i <= cant_ciex; i++) {
	 	 var cod_ciex = $("#hdd_ciex_diagnostico_"+i).val();
	 	 var val_ojos = $("#valor_ojos_"+i).val();
	 	 if (cod_ciex != '') {
	 	 	params += '&cod_ciex_' + i + '=' + cod_ciex + '&val_ojos_' + i + '=' + val_ojos;
	 	 }
	}
	
	//Tonometria
	var cant_tono = $('#cant_tonometria').val();
	var h = 0;
	for (i = 1; i <= cant_tono; i++) {
		
		var tonometria_valor_od = $("#tonometria_valor_od_"+i).val();
		var tonometria_dilatado_od = $("#tonometria_dilatado_od_"+i).val();     
		var tonometria_valor_oi = $("#tonometria_valor_oi_"+i).val();  
		var tonometria_dilatado_oi = $("#tonometria_dilatado_oi_"+i).val();
	 	var tonometria_fecha = $("#tonometria_fecha_"+i).val();
	 	var tonometria_hora = $("#tonometria_hora_"+i).val();
	 	
	 	if (tonometria_valor_od != '' || tonometria_dilatado_od != '' || tonometria_valor_oi != '' || tonometria_dilatado_oi != '') {
	 	 	params += '&tonometria_valor_od_' + i + '=' + tonometria_valor_od + 
	 	 			  '&tonometria_dilatado_od_' + i + '=' + tonometria_dilatado_od +
	 	 			  '&tonometria_valor_oi_' + i + '=' + tonometria_valor_oi +
	 	 			  '&tonometria_dilatado_oi_' + i + '=' + tonometria_dilatado_oi +
	 	 			  '&tonometria_fecha_' + i + '=' + tonometria_fecha + 
	 	 			  '&tonometria_hora_' + i + '=' + tonometria_hora; 
	 	 	var h = h + 1;			  
	 	}
	}
	params += '&cant_tono=' + h;
	
	var hdd_id_hc_consulta = $('#hdd_id_hc_consulta').val();
	var hdd_id_admision = $('#hdd_id_admision').val();
	var hdd_id_paciente = $('#hdd_id_paciente').val();
	var enfermedad_actual = str_encode(CKEDITOR.instances.txt_enfermedad_actual.getData());
	var muscular_balance = str_encode($('#muscular_balance').val());
	var muscular_motilidad = str_encode($('#muscular_motilidad').val());
	var muscular_ppc = str_encode($('#muscular_ppc').val());
	var biomi_orbita_parpados_od = str_encode($('#biomi_orbita_parpados_od').val());
	var biomi_sist_lagrimal_od = str_encode($('#biomi_sist_lagrimal_od').val());
	var biomi_conjuntiva_od = str_encode($('#biomi_conjuntiva_od').val());
	var biomi_cornea_od = str_encode($('#biomi_cornea_od').val());
	var biomi_cam_anterior_od = str_encode($('#biomi_cam_anterior_od').val());
	var biomi_iris_od = str_encode($('#biomi_iris_od').val());
	var biomi_cristalino_od = str_encode($('#biomi_cristalino_od').val());
	var biomi_vanherick_od = $('#biomi_vanherick_od').val();
	var biomi_orbita_parpados_oi = str_encode($('#biomi_orbita_parpados_oi').val());
	var biomi_sist_lagrimal_oi = str_encode($('#biomi_sist_lagrimal_oi').val());
	var biomi_conjuntiva_oi = str_encode($('#biomi_conjuntiva_oi').val());
	var biomi_cornea_oi = str_encode($('#biomi_cornea_oi').val());
	var biomi_cam_anterior_oi = str_encode($('#biomi_cam_anterior_oi').val());
	var biomi_iris_oi = str_encode($('#biomi_iris_oi').val());
	var biomi_cristalino_oi = str_encode($('#biomi_cristalino_oi').val());
	var biomi_vanherick_oi = $('#biomi_vanherick_oi').val();
	var goniosco_superior_od = $('#goniosco_superior_od').val();
	var goniosco_inferior_od = $('#goniosco_inferior_od').val();
	var goniosco_nasal_od = $('#goniosco_nasal_od').val();
	var goniosco_temporal_od = $('#goniosco_temporal_od').val();
	var goniosco_superior_oi = $('#goniosco_superior_oi').val();
	var goniosco_inferior_oi = $('#goniosco_inferior_oi').val();
	var goniosco_nasal_oi = $('#goniosco_nasal_oi').val();
	var goniosco_temporal_oi = $('#goniosco_temporal_oi').val();
	var tonometria_nervio_optico_od = str_encode($('#tonometria_nervio_optico_od').val());
	var tonometria_macula_od = str_encode($('#tonometria_macula_od').val());
	var tonometria_periferia_od = str_encode($('#tonometria_periferia_od').val());
	var tonometria_vitreo_od = str_encode($('#tonometria_vitreo_od').val());
	var tonometria_nervio_optico_oi = str_encode($('#tonometria_nervio_optico_oi').val());
	var tonometria_macula_oi = str_encode($('#tonometria_macula_oi').val());
	var tonometria_periferia_oi = str_encode($('#tonometria_periferia_oi').val());
	var tonometria_vitreo_oi = str_encode($('#tonometria_vitreo_oi').val());
	var diagnostico_oftalmo = str_encode(CKEDITOR.instances.txt_diagnostico_oftalmo.getData());
	var solicitud_examenes = str_encode(CKEDITOR.instances.txt_solicitud_examenes.getData());
	var tratamiento_oftalmo = str_encode(CKEDITOR.instances.txt_tratamiento_oftalmo.getData());
	var img_biomiocroscopia = str_encode($('#img_biomiocroscopia').val());
	var img_tonometria_od = str_encode($('#img_tonometria_od').val());
	var img_tonometria_oi = str_encode($('#img_tonometria_oi').val());
	var desc_antecedentes_medicos = str_encode(CKEDITOR.instances.txt_desc_antecedentes_medicos.getData());
	var observaciones_gonioscopia = str_encode(CKEDITOR.instances.txt_observaciones_gonioscopia.getData());
	var medicamentos_oftalmo = str_encode($('#medicamentos_oftalmo').val());
	var nombre_medico_preconsulta = str_encode($('#nombre_medico_preconsulta').val());
	var observaciones_tonometria = str_encode(CKEDITOR.instances.txt_observaciones_tonometria.getData());
	
	params += '&hdd_id_hc_consulta='+ hdd_id_hc_consulta +
			  '&hdd_id_admision=' + hdd_id_admision +
			  '&hdd_id_paciente=' + hdd_id_paciente + 
			  '&enfermedad_actual=' + enfermedad_actual +
			  '&array_antecedentes_medicos_ids=' + array_antecedentes_medicos_ids +
			  '&array_antecedentes_medicos_val=' + array_antecedentes_medicos_val +
			  '&muscular_balance=' + muscular_balance +
			  '&muscular_motilidad=' + muscular_motilidad +
			  '&muscular_ppc=' + muscular_ppc +
			  '&biomi_orbita_parpados_od=' + biomi_orbita_parpados_od +
			  '&biomi_sist_lagrimal_od=' + biomi_sist_lagrimal_od +
			  '&biomi_conjuntiva_od=' + biomi_conjuntiva_od +
			  '&biomi_cornea_od=' + biomi_cornea_od +
			  '&biomi_cam_anterior_od=' + biomi_cam_anterior_od +
			  '&biomi_iris_od=' + biomi_iris_od +
			  '&biomi_cristalino_od=' + biomi_cristalino_od +
			  '&biomi_vanherick_od=' + biomi_vanherick_od +
			  '&biomi_orbita_parpados_oi=' + biomi_orbita_parpados_oi +
			  '&biomi_sist_lagrimal_oi=' + biomi_sist_lagrimal_oi +
			  '&biomi_conjuntiva_oi=' + biomi_conjuntiva_oi +
			  '&biomi_cornea_oi=' + biomi_cornea_oi +
			  '&biomi_cam_anterior_oi=' + biomi_cam_anterior_oi +
			  '&biomi_iris_oi=' + biomi_iris_oi +
			  '&biomi_cristalino_oi=' + biomi_cristalino_oi +
			  '&biomi_vanherick_oi=' + biomi_vanherick_oi +
			  '&goniosco_superior_od=' + goniosco_superior_od +
			  '&goniosco_inferior_od=' + goniosco_inferior_od +
			  '&goniosco_nasal_od=' + goniosco_nasal_od +
			  '&goniosco_temporal_od=' + goniosco_temporal_od +
			  '&goniosco_superior_oi=' + goniosco_superior_oi +
			  '&goniosco_inferior_oi=' + goniosco_inferior_oi +
			  '&goniosco_nasal_oi=' + goniosco_nasal_oi +
			  '&goniosco_temporal_oi=' + goniosco_temporal_oi +
			  '&tonometria_nervio_optico_od=' + tonometria_nervio_optico_od +
			  '&tonometria_macula_od=' + tonometria_macula_od +
			  '&tonometria_periferia_od=' + tonometria_periferia_od +
			  '&tonometria_vitreo_od=' + tonometria_vitreo_od +
			  '&tonometria_nervio_optico_oi=' + tonometria_nervio_optico_oi +
			  '&tonometria_macula_oi=' + tonometria_macula_oi +
			  '&tonometria_periferia_oi=' + tonometria_periferia_oi +
			  '&tonometria_vitreo_oi=' + tonometria_vitreo_oi +
			  '&diagnostico_oftalmo=' + diagnostico_oftalmo +
			  '&solicitud_examenes=' + solicitud_examenes +
			  '&tratamiento_oftalmo=' + tratamiento_oftalmo +
			  '&img_biomiocroscopia=' + img_biomiocroscopia +
			  '&img_tonometria_od=' + img_tonometria_od +
			  '&img_tonometria_oi=' + img_tonometria_oi +
			  '&img_biomiocroscopia_modificado=' + obj_imagen_muscular.get_modificado() +
			  '&img_tonometria_od_modificado=' + obj_imagen_tonometria_od.get_modificado() +
			  '&img_tonometria_oi_modificado=' + obj_imagen_tonometria_oi.get_modificado() +
			  '&tipo_guardar=' + tipo +
			  '&desc_antecedentes_medicos=' + desc_antecedentes_medicos +
			  '&observaciones_gonioscopia=' + observaciones_gonioscopia +
			  '&medicamentos_oftalmo=' + medicamentos_oftalmo +
			  '&nombre_medico_preconsulta=' + nombre_medico_preconsulta +
			  '&observaciones_tonometria=' + observaciones_tonometria +
			  '&cadena_colores=' + obtener_cadena_colores();
	
	llamarAjax("consulta_oftalmologia_ajax.php", params, "guardar_oftalmologia", "validar_exito();");
}

function validar_exito() {
    var hdd_exito = $('#hdd_exito').val();
    var hdd_url_menu = $('#hdd_url_menu').val();
    var hdd_tipo_guardar = $('#hdd_tipo_guardar').val();
    
    if (hdd_tipo_guardar == 1 || hdd_tipo_guardar == 4) { //Cierra el formulario
    	$('.formulario').css('display', 'none');
	    if (hdd_exito > 0) {
	        $("#contenedor_exito").css("display", "block");
	        $('#contenedor_exito').html('Datos guardados correctamente');
	        setTimeout("enviar_credencial('" + hdd_url_menu + "')", 3000);
	    } else {
	        $("#contenedor_error").css("display", "block");
	        $('#contenedor_error').html('Error al guardar usuarios');
	        setTimeout("enviar_credencial('" + hdd_url_menu + "')", 3000);
	    }
    } else { //Permanece en el formulario
    	if (hdd_exito > 0) {
	        $("#contenedor_exito").css("display", "block");
	        $('#contenedor_exito').html('Datos guardados correctamente');
	        setTimeout('$("#contenedor_exito").css("display", "none")', 3000);
	    } else {
	        $("#contenedor_error").css("display", "block");
	        $('#contenedor_error').html('Error al guardar usuarios');
	        setTimeout('$("#contenedor_error").css("display", "none")', 3000);
	    }
    }
	window.scrollTo(0, 0);
}

function guardar_imagenes() {
	if (obj_imagen_muscular.get_modificado() == 1) {
		obj_imagen_muscular.sendToServerMuscular();
	}
	if (obj_imagen_tonometria_od.get_modificado() == 1) {
		obj_imagen_tonometria_od.sendToServerTonometria_od();
	}
	if (obj_imagen_tonometria_oi.get_modificado() == 1) {
		obj_imagen_tonometria_oi.sendToServerTonometria_oi();
	}
}

function agregar_antecedentes(id_hc){
	var params='opcion=2&id_hc='+id_hc;
	llamarAjax("consulta_oftalmologia_ajax.php", params, "d_interno", "mostrar_formulario_flotante(1); reducir_formulario_flotante(600, 300);");
}

function agregar_antecedentes_medicos(id_hc) {
	var params = 'opcion=3&id_hc=' + id_hc;
	
	//Antecedentes medicos
	var array_antecedentes_medicos_ids = new Array();
	var array_antecedentes_medicos_val = new Array();
	$("input[name='check_medicos_otros']:checked").each(function() {	
	   var checkbox = $(this);
	   //alert(checkbox.val()+' = '+checkbox.is(':checked'));
	   array_antecedentes_medicos_ids.push(checkbox.val());
	   array_antecedentes_medicos_val.push(checkbox.is(':checked'));
	});
	
	params += '&array_antecedentes_medicos_ids=' + array_antecedentes_medicos_ids +
			  '&array_antecedentes_medicos_val=' + array_antecedentes_medicos_val;
	
	llamarAjax("consulta_oftalmologia_ajax.php", params, "otros_antecedentes_medicos", "mostrar_formulario_flotante(0);validar_check_ant_medicos();");
	
}

function agregar_antecedentes_otros(id_hc){
	var params = 'opcion=4&id_hc=' + id_hc;
	llamarAjax("consulta_oftalmologia_ajax.php", params, "d_interno", "mostrar_formulario_flotante(1); reducir_formulario_flotante(600, 300);");
}

function agregar_otros_antecedentes_otros(id_hc){
	var antecedentes_otros_oculto = $('#antecedentes_otros_oculto').val();
	var antecedentes_otros = $('#antecedentes_otros').val();
	
	var params = 'opcion=5&id_hc=' + id_hc;
	
	//Antecedentes medicos
	var array_antecedentes_otros_ids = new Array();
	var array_antecedentes_otros_val = new Array();
	var text_antecedentes_otros_ids = '';
	$("input[name='check_otros_']:checked").each(function() {	
	   var checkbox = $(this);
	   text_antecedentes_otros_ids = text_antecedentes_otros_ids + '-' + checkbox.val();
	   array_antecedentes_otros_ids.push(checkbox.val());
	   array_antecedentes_otros_val.push(checkbox.is(':checked'));
	});
	
	if (text_antecedentes_otros_ids == '') {
		$('#antecedentes_otros').val(antecedentes_otros_oculto);
	} else {
		$('#antecedentes_otros').val($('#antecedentes_otros').val()+text_antecedentes_otros_ids);	  	
	}
	
	params += '&array_antecedentes_otros_ids=' + array_antecedentes_otros_ids +
			  '&array_antecedentes_otros_val=' + array_antecedentes_otros_val;
	
	llamarAjax("consulta_oftalmologia_ajax.php", params, "otros_antecedentes_otros", "mostrar_formulario_flotante(0);");
}

function marcar_sano_oft(id_campo, ind_iris) {
	if (ind_iris == 1) {
		$("#" + id_campo).val("Marr\u00F3n PNCR");
	} else {
		$("#" + id_campo).val("Sin alteraci\u00F3n");
	}
	$("#" + id_campo).trigger("input");
}

function marcar_sano_oft_todos(tipo) {
	switch (tipo) {
		case 1: //Biomicroscopia
			$("#biomi_orbita_parpados_od").val("Sin alteraci\u00F3n");
			$("#biomi_orbita_parpados_oi").val("Sin alteraci\u00F3n");
			$("#biomi_sist_lagrimal_od").val("Sin alteraci\u00F3n");
			$("#biomi_sist_lagrimal_oi").val("Sin alteraci\u00F3n");
			$("#biomi_conjuntiva_od").val("Sin alteraci\u00F3n");
			$("#biomi_conjuntiva_oi").val("Sin alteraci\u00F3n");
			$("#biomi_cornea_od").val("Sin alteraci\u00F3n");
			$("#biomi_cornea_oi").val("Sin alteraci\u00F3n");
			$("#biomi_cam_anterior_od").val("Sin alteraci\u00F3n");
			$("#biomi_cam_anterior_oi").val("Sin alteraci\u00F3n");
			$("#biomi_iris_od").val("Marr\u00F3n PNCR");
			$("#biomi_iris_oi").val("Marr\u00F3n PNCR");
			$("#biomi_cristalino_od").val("Sin alteraci\u00F3n");
			$("#biomi_cristalino_oi").val("Sin alteraci\u00F3n");
			$("#biomi_orbita_parpados_od").trigger("input");
			$("#biomi_orbita_parpados_oi").trigger("input");
			$("#biomi_sist_lagrimal_od").trigger("input");
			$("#biomi_sist_lagrimal_oi").trigger("input");
			$("#biomi_conjuntiva_od").trigger("input");
			$("#biomi_conjuntiva_oi").trigger("input");
			$("#biomi_cornea_od").trigger("input");
			$("#biomi_cornea_oi").trigger("input");
			$("#biomi_cam_anterior_od").trigger("input");
			$("#biomi_cam_anterior_oi").trigger("input");
			$("#biomi_iris_od").trigger("input");
			$("#biomi_iris_oi").trigger("input");
			$("#biomi_cristalino_od").trigger("input");
			$("#biomi_cristalino_oi").trigger("input");
			break;
			
		case 2: //Fondo de ojo
			$("#tonometria_nervio_optico_od").val("Sin alteraci\u00F3n");
			$("#tonometria_nervio_optico_oi").val("Sin alteraci\u00F3n");
			$("#tonometria_macula_od").val("Sin alteraci\u00F3n");
			$("#tonometria_macula_oi").val("Sin alteraci\u00F3n");
			$("#tonometria_nervio_optico_od").trigger("input");
			$("#tonometria_nervio_optico_oi").trigger("input");
			$("#tonometria_macula_od").trigger("input");
			$("#tonometria_macula_oi").trigger("input");
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

function mostrar_tonometria() {
	var lista_tabla = $("#cant_tonometria").val();
	
	for (i = 1; i <= lista_tabla; i++) {
		$("#tabla_tono_" + i).css("display", "table-row");
	}
}

function restar_tabla_tono() {
	var lista_tabla = $("#cant_tonometria").val();
	
	if (lista_tabla > 1) {
		$("#tabla_tono_" + lista_tabla).css("display", "none");
		$("#tonometria_valor_od_" + lista_tabla).val("");
		$("#tonometria_dilatado_od_" + lista_tabla).val("");
		$("#tonometria_valor_oi_" + lista_tabla).val("");
		$("#tonometria_dilatado_oi_" + lista_tabla).val("");
		var total = parseInt(lista_tabla, 10) - 1;
		$("#cant_tonometria").val(total);
	}
}

function agregar_tabla_tono() {
	var lista_tabla = $("#cant_tonometria").val();
	var total = parseInt(lista_tabla, 10) + 1;
	if (total <= 10) {
		$("#tabla_tono_" + total).css("display", "table-row");
		$("#cant_tonometria").val(total);
	}
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
		if (checkbox.is(':checked')) {
			bol_checked = true;
		}
	});
	
	if (bol_checked) {
		$("#tbl_desc_antecedentes_medicos").css("display", "table");
	} else {
		$("#tbl_desc_antecedentes_medicos").css("display", "none");
	}
}

function seleccionar_antecedente_medico(indice) {
	var txt_base = CKEDITOR.instances.txt_desc_antecedentes_medicos.getData();
	var txt_busq = "<p><strong>" + remplazar_acentos($("#hdd_nombre_ant_med_" + indice).val(), "H") + ":";
	
	var pos_aux = txt_base.indexOf(txt_busq);
	if ($("#chk_ant_med_" + indice).is(":checked")) {
		if (pos_aux == -1) {
			if (txt_base != "") {
				var pos_aux2 = txt_base.lastIndexOf("<p>&nbsp;</p>");
				if ((pos_aux2 != -1 && (txt_base.length - pos_aux2) > 14) || pos_aux2 == -1) {
					txt_base += "<p>&nbsp;</p>";
				}
			}
			txt_base += "<p><strong>" + $("#hdd_nombre_ant_med_" + indice).val() + ":</strong>&nbsp;</p>";
			CKEDITOR.instances.txt_desc_antecedentes_medicos.setData(txt_base);
		}
	} else if (pos_aux != -1) {
		var pos_aux2 = txt_base.indexOf("<p><strong>", pos_aux + 10);
		if (pos_aux2 != -1) {
			txt_base = txt_base.substring(0, pos_aux) + txt_base.substring(pos_aux2);
		} else {
			txt_base = txt_base.substring(0, pos_aux);
		}
		CKEDITOR.instances.txt_desc_antecedentes_medicos.setData(txt_base);
	}
}
