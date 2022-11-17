
/***********************************************/
/***********************************************/
/***********************************************/

/*$(document).ready( function() { 
	config_reproducido("OI"); 
	config_reproducido("OD"); 
});*/

if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
	CKEDITOR.tools.enableHtml5Elements(document);
}

CKEDITOR.config.height = 70;
CKEDITOR.config.width = "auto";

var initCKEditorNeso = (function(id_obj) {
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

/* Retorna la coordenada X de un huso horario */
function px(huso){
	switch (huso) {				
		case 1: return 190; break; 
		case 2: return 232; break; 
		case 3: return 247; break; 
		case 4: return 232; break; 
		case 5: return 190; break; 
		case 6: return 135; break; 
		case 7: return 78; break; 
		case 8: return 36; break; 
		case 9: return 20; break; 
		case 10: return 36; break; 
		case 11: return 78; break; 
		case 12: return 135; break; 
	} 
}

/* Retorna la coordenada Y de un huso horario */
function py(huso){ 
	switch (huso) { 				
		case 1: return 36; break; 
		case 2: return 78; break; 
		case 3: return 135; break; 
		case 4: return 190; break; 
		case 5: return 232; break; 
		case 6: return 247; break; 
		case 7: return 232; break; 
		case 8: return 190; break; 
		case 9: return 135; break; 
		case 10: return 78; break; 
		case 11: return 36; break; 
		case 12: return 20; break; 
	} 
}	

/* Accede al CANVAS en el iframe de cada objeto de dibujo (pizarra) */
function getContextoCanvas(){
	doc_iframe=window.frames['ifr_neso_img_od'].contentWindow.document;
	obj_canvas=doc_iframe.getElementsByTagName("canvas")[1]; //vector {canvas.wPaint-canvas-bg, canvas.wPaint-canvas, canvas.wPaint-canvas-temp}
	context=obj_canvas.getContext('2d'); 
	return context; 
}

/* Dibuja cada lesión NESO descrita en "Husos horarios comprometidos" */
function dibujarNeso(context){
	// Constantes
	var mmcornea=12; //Longitud promedio de una córnea; milímetros
	var xcentro=135; //Coordenada X del canvas, correspondiente al centro de la córnea 
	var ycentro=135; //Coordenada Y del canvas, correspondiente al centro de la córnea 
	
	// Variables de entrada 
	var huso_ini=5; 
	var canti_husos=3; 
	var mm=5; 
	
	var huso_fin, huso_medio; 				
	
	contexto=getContextoCanvas(); 
	//contexto=iniciaCanvas("myCanvas3", 300, 300); 
	//contexto.drawImage(Imagen_husos, 0, 0); 
	
	contexto.lineWidth = 3; 
	/*xini=px(5); 
	yini=py(5); 
	xfin=px(8); 
	yfin=py(8);*/
	//xmedio=px(11); 
	//ymedio=py(11);
	//xmedio=135;
	//ymedio=135;
	
	var distancia1=120; 
	xini=Math.cos( (Math.PI/6) * (huso_ini-3) ) * xcentro + ((mmcornea - mm) / mmcornea) + distancia1; 
	yini=Math.sin( (Math.PI/6) * (huso_ini-3) ) * ycentro + ((mmcornea - mm) / mmcornea) + distancia1; 
	
	huso_fin=huso_ini+canti_husos;
	xfin=Math.cos( (Math.PI/6) * (huso_fin-3) ) * xcentro + ((mmcornea - mm) / mmcornea) + distancia1; 
	yfin=Math.sin( (Math.PI/6) * (huso_fin-3) ) * ycentro + ((mmcornea - mm) / mmcornea) + distancia1; 
	
	huso_medio = Math.round( Math.abs(huso_fin - huso_ini) / 2 ); 		
	xmedio=Math.cos( (Math.PI/6) * (huso_medio-3) ) * xcentro + ((mmcornea - mm) / mmcornea) + distancia1; 
	ymedio=Math.sin( (Math.PI/6) * (huso_medio-3) ) * ycentro + ((mmcornea - mm) / mmcornea) + distancia1; 		
					
	contexto.strokeStyle="green";				
	contexto.beginPath();
	contexto.bezierCurveTo(xini, yini, xmedio, ymedio, xfin, yfin); 
	contexto.stroke(); 
	
	contexto.strokeStyle="red";
	contexto.beginPath();		
	//contexto.moveTo(xini, yini); 
	//contexto.quadraticCurveTo(xmedio, ymedio, xfin, yfin); 
	//contexto.moveTo(px(huso_ini), py(huso_ini)); 
	contexto.moveTo(150, 150); 
	contexto.quadraticCurveTo(xmedio, ymedio, px(huso_fin), py(huso_fin)); 
	contexto.stroke();	
}	

function guardar_imagenes_neso() {
console.log("INI guardar imgs neso");
	document.getElementById("ifr_neso_img_od").contentWindow.guardar_imagen();
	document.getElementById("ifr_neso_img_oi").contentWindow.guardar_imagen();
console.log("FIN guardar imgs neso");	
}

function validar_ojo_neso(ojo){
console.log("validar_ojo");		
	var resultado=0; 
	var boo_husos=false;
	
	ojo=ojo.toLowerCase();

	$("#table_husos_" + ojo).removeClass("borde_error"); 
	//$("#table_husos_" + ojo).css({"color": "#5B5B5B"});	
	$("#neso_mm_cornea_" + ojo).removeClass("borde_error"); 
	$("#neso_mm_cornea_").css({"color": "#5B5B5B"});
	$("#neso_ind_recidivante_" + ojo).removeClass("borde_error"); 
	$("#neso_ind_recidivante_").css({"color": "#5B5B5B"});	
	
	for (i=1; i<=12; i++) { 
		if($("#neso_huso" + i + "_" + ojo).is(":checked")) { boo_husos=true; break; } 
	} 	
	
	if (boo_husos===false) { 
		
		resultado = -2; 
		
		//Ningún campo dependiente debe estar digitado 
		
		if (/*!isNaN(parseInt($("#neso_mm_cornea_").val()))*/$("#neso_mm_cornea_" + ojo).val() != "" 
			|| $("#neso_ind_recidivante_" + ojo).val() != ""  
		) {
			$("#table_husos_" + ojo).addClass("borde_error"); 
			//$("#table_husos_" + ojo).css({"color": "#FF002A"}); 			
			resultado = -1; 
		}
	} else { 

		//Validar campos dependientes: 
		
		if ($("#neso_mm_cornea_" + ojo).val() == "") { 
			$("#neso_mm_cornea_" + ojo).addClass("borde_error"); 
			$("#neso_mm_cornea_").css({"color": "#5B5B5B"}); 
			resultado = -1; 
		}
		if ($("#neso_ind_recidivante_" + ojo).val() == "") { 
			$("#neso_ind_recidivante_" + ojo).addClass("borde_error"); 
			$("#neso_ind_recidivante_").css({"color": "#5B5B5B"}); 
			resultado = -1; 
		} 	
	}
	
	return resultado; 
}

function validar_consulta_neso() {
	var resultado = 0, resultado1 = 0, resultado2 = 0;
	var ojo;
	
	$("#label_husos").removeClass("borde_error");
	$("#label_husos").css({"color": "#5B5B5B"}); 
	$("#neso_ind_interferon").removeClass("borde_error"); 
	$("#neso_ind_interferon").css({"color": "#5B5B5B"}); 
	$("#neso_dosis").removeClass("borde_error"); 
	$("#neso_dosis").css({"color": "#5B5B5B"});		

	if ($("#neso_ind_interferon").val()=="") {
		$("#neso_ind_interferon").addClass("borde_error"); 
		$("#neso_ind_interferon").css({"color": "#5B5B5B"}); 		
		resultado=-1;
	}

	// Si usa interferón, pedir Número de dosis 
	if ($("#neso_ind_interferon").val()=="1" && isNaN(parseInt($("#neso_dosis").val()))) { 
		$("#neso_dosis").addClass("borde_error"); 
		$("#neso_dosis").css({"color": "#5B5B5B"}); 	
		resultado=-1;
	}	

	// Seleccionar mínimo un ojo con NESO
	resultado1 = validar_ojo_neso("OD");	
	resultado2 = validar_ojo_neso("OI");	
	
	if ( resultado1<0 || resultado2<0 ) {
		resultado=-1;		
	} 
	if ( resultado1==-2 && resultado2==-2 ) {
		$("#label_husos").addClass("borde_error");
		$("#label_husos").css({"color": "#FF002A"});
	}	
	
	return resultado; 
}

function obtener_parametros_consulta_neso() {
console.log("obt pr qneso");	
	//Se guardan las imágenes
	guardar_imagenes_neso();
	
	var neso_observaciones = str_encode(CKEDITOR.instances.neso_observaciones.getData());
	
	//if($("#neso_huso1_od").is(":checked")) {var neso_huso1_od = 1;} else {var neso_huso1_od = 0;}    
	var params = "&neso_ind_interferon_od=" + $("#neso_ind_interferon_od").val() + 
				"&neso_dosis_od=" + $("#neso_dosis_od").val() + 	
				"&neso_img_od=" + str_encode($("#neso_img_od").val()) + 
				"&neso_ind_recidivante_od=" + $("#neso_ind_recidivante_od").val() + 
				"&neso_ind_interferon_oi=" + $("#neso_ind_interferon_oi").val() + 
				"&neso_dosis_oi=" + $("#neso_dosis_oi").val() + 	
				"&neso_img_oi=" + str_encode($("#neso_img_oi").val()) + 
				"&neso_ind_recidivante_oi=" + $("#neso_ind_recidivante_oi").val() +  
				"&neso_observaciones=" + neso_observaciones; 	 

				
	//Para lesiones NESO
	canti_lesiones=6;
	canti = canti_lesiones; //$("#hdd_canti_abv").val(); 
	//params += "&hdd_canti_lesiones_od=" + canti;
	params += "&hdd_canti_lesiones=" + canti; //hdd_canti_lesiones			
	for (i = 1; i <= canti; i++) { 
		id_ojo=$("#neso_hdd_idojo_"+i).val(); //79:OD; 80:OI  
		canti_husos=$("#neso_nhusos_"+i).val(); 
		huso_ini=$("#neso_husoini_"+i).val();
		mmcornea=$("#neso_mmcornea_"+i).val();  
		
		fila_valida=true; 
		if (canti_husos == "44") { fila_valida=false; }
		if (fila_valida==true) { 
			params += "&neso_les_id_ojo_" + i + "=" + id_ojo + 
				"&neso_les_canti_husos_" + i + "=" + canti_husos +
				"&neso_les_id_huso_ini_" + i + "=" + huso_ini +
				"&neso_les_mmcornea_" + i + "=" + mmcornea;
		} 
	}
/*	
	//Para lesiones NESO
	canti_lesiones=3;
	canti = canti_lesiones; //$("#hdd_canti_abv").val(); 
	//params += "&hdd_canti_lesiones_od=" + canti;
	params += "&hdd_canti_lesiones=" + 6; //hdd_canti_lesiones			
	for (i = 1; i <= canti; i++) { 
		id_ojo=79; //79:OD; 80:OI  
		canti_husos=$("#neso_nhusos_od_"+i).val(); 
		huso_ini=$("#neso_husoini_od_"+i).val();
		mmcornea=$("#neso_mmcornea_od_"+i).val();  
		
		fila_valida=true; 
		if (fila_valida==true) { 
			params += "&neso_les_id_ojo_" + i + "=" + id_ojo + 
				"&neso_les_canti_husos_" + i + "=" + canti_husos +
				"&neso_les_id_huso_ini_" + i + "=" + huso_ini +
				"&neso_les_mmcornea_" + i + "=" + mmcornea;
		} 
	} 
	
	canti = canti_lesiones; //$("#hdd_canti_abv").val(); 
	//params += "&hdd_canti_lesiones_oi=" + canti;
	for (i = 1; i <= canti; i++) { 
		id_ojo=80; //79:OD; 80:OI  
		canti_husos=$("#neso_nhusos_oi_"+i).val(); 
		huso_ini=$("#neso_husoini_oi_"+i).val();
		mmcornea=$("#neso_mmcornea_oi_"+i).val();  
		
		i2=canti+i;
		fila_valida=true; 
		if (fila_valida==true) { 
			params += "&neso_les_id_ojo_" + i2 + "=" + id_ojo + 
				"&neso_les_canti_husos_" + i2 + "=" + canti_husos +
				"&neso_les_id_huso_ini_" + i2 + "=" + huso_ini +
				"&neso_les_mmcornea_" + i2 + "=" + mmcornea;
		} 
	}
	*/
	console.log(params); 
	
	return params; 
}
/*
function config_grado_neso(sufijo_ojo) { 
	sufijo_ojo=sufijo_ojo.toLowerCase(); 
	if ($("#pte_grado_"+sufijo_ojo).val()=="") { 
		$("#pte_reproducido_"+sufijo_ojo).val(""); 
		$("#pte_conjuntiva_sup_"+sufijo_ojo).val(""); 
		$("#pte_astigmatismo_"+sufijo_ojo).val(""); 
	}  
} 

function config_reproducido_neso(sufijo_ojo) { 
	sufijo_ojo=sufijo_ojo.toLowerCase(); 	
	if ($("#pte_reproducido_"+sufijo_ojo).val()==1) { 
		$("#pte_conjuntiva_sup_"+sufijo_ojo).attr("disabled", false); 
	} else { 
		$("#pte_conjuntiva_sup_"+sufijo_ojo).val(""); 
		$("#pte_conjuntiva_sup_"+sufijo_ojo).attr("disabled", true); 
	} 
} 
*/