function validarBuscarPersonasHc(){$("#frmRegistroCx").validate({rules:{txt_paciente_hc:{required:true,},},submitHandler:function(){$("#contenedor_error").css("display","none");var _1=$("#txt_paciente_hc").val();var _2="opcion=1&txt_paciente_hc="+_1;llamarAjax("registro_cx_ajax.php",_2,"contenedor_paciente_hc","");return false;},});};function validar_buscar_hc(){var _3=0;$("#txt_paciente_hc").removeClass("borde_error");if($("#txt_paciente_hc").val()==""){$("#txt_paciente_hc").addClass("borde_error");_3=1;}return _3;};function mostrar_formulario_cx(_4,_5,_6,_7,_8,_9){mostrar_formulario_flotante(1);$("#d_interno").empty();posicionarDivFlotante("d_centro");reducir_formulario_flotante("1050","700");$("#d_centro").height(700);$("#d_interno").height(700-35);var _a=document.createElement("iframe");_a.id="HcFrame";ruta=_6+"?hdd_id_admision="+_4+"&hdd_id_hc="+_5+"&credencial="+_7+"&hdd_numero_menu="+_8+"&tipo_entrada=2"+"&ind_complemento="+_9;_a.setAttribute("src",ruta);_a.style.height="100%";_a.style.width="1050px";var _b=document.getElementById("HcFrame");$("#d_interno").append(_a);};function ver_registros_hc(_c,_d,_e,_f,_10,_11,_12){var _13="opcion=2&id_persona="+_c+"&nombre_persona="+_d+"&documento_persona="+_e+"&tipo_documento="+_f+"&telefonos="+_10+"&fecha_nacimiento="+_11+"&edad_paciente="+_12;llamarAjax("registro_cx_ajax.php",_13,"contenedor_paciente_hc","");};function imprimir_hoja_stickers(_14,_15){var _16="opcion=1&id_admision="+_14+"&id_hc="+_15;llamarAjax("hoja_stickers_ajax.php",_16,"d_impresion_stickers","imprSelec(\"d_campo_imprimir\");");};function mostrar_cargar_stickers(_17){$("#fondo_negro").css("display","block");$("#d_centro_stickers").slideDown(400).css("display","block");$("#d_centro_stickers").css("width",600);$("#d_centro_stickers").css("height","250px");$("#d_centro_stickers").css("top","20%");$("#d_interno_stickers").css("width",585);posicionarDivFlotante("d_centro_stickers");$("#d_interno_stickers").css("height","auto");$("#hdd_id_hc_stickers").val(_17);};function cargar_hoja_stickers(){var _18=$("#fil_hoja_stickers").val();if(_18!=""){var _19=obtener_extension_archivo(_18);if(_19!="jpg"&&_19!="png"&&_19!="bmp"&&_19!="gif"&&_19!="pdf"){alert("El archivo a cargar debe ser una imagen o un archivo pdf");return;}$("#frm_arch_stickers").submit();cerrar_div_centro_stickers();alert("Archivo cargado con ?xito");}else{alert("Debe seleccionar un archivo");return;}};function obtener_extension_archivo(_1a){var _1b=_1a.substring(_1a.lastIndexOf(".")+1).toLowerCase();return _1b;};function cerrar_div_centro_stickers(){$("#fondo_negro").css("display","none");$("#d_centro_stickers").slideDown(400).css("display","none");};