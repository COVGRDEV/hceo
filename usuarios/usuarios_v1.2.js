function mostrar_formulario_flotante(_1){if(_1==1){$("#fondo_negro").css("display","block");$("#d_centro").slideDown(400).css("display","block");}else{if(_1==0){$("#fondo_negro").css("display","none");$("#d_centro").slideDown(400).css("display","none");}}};function reducir_formulario_flotante(_2,_3){$(".div_centro").width(_2);$(".div_centro").css("top","20%");$(".div_interno").width(_2);};function mostrar_formulario(_4){if(_4==1){$(".formulario").slideDown(600).css("display","block");}else{if(_4==0){$(".formulario").slideUp(600).css("display","none");}}};function ver_todos_usuarios(){$("#txt_busca_usuario").val("");var _5=$("#txt_busca_usuario").val();var _6="opcion=1&txt_busca_usuario="+_5;llamarAjax("usuarios_ajax.php",_6,"principal_usuarios","mostrar_formulario(1)");};function buscar_usuarios(){$("#listado_usuarios").validate({rules:{txt_busca_usuario:{required:true,}},submitHandler:function(){var _7=$("#txt_busca_usuario").val();var _8="opcion=1&txt_busca_usuario="+_7;llamarAjax("usuarios_ajax.php",_8,"principal_usuarios","mostrar_formulario(1)");return false;},});};function llamar_crear_usuarios(){var _9="opcion=2&txt_busca_usuario="+txt_busca_usuario;llamarAjax("usuarios_ajax.php",_9,"principal_usuarios","mostrar_formulario(1)");};function validar_usuario_existente(_a){_a=$(_a).val();var _b="opcion=3&nombre_usuario="+_a;llamarAjax("usuarios_ajax.php",_b,"div_usuario_existe","");};function validar_documento_existente(_c,_d,_e){_c=$(_c).val();if(_d==1){var _f="opcion=5&documento_usuario="+_c+"&tipo="+_d+"&id_usuario="+_e;llamarAjax("usuarios_ajax.php",_f,"div_documento_existe","");}else{if(_d==2){var _f="opcion=5&documento_usuario="+_c+"&tipo="+_d+"&id_usuario="+_e;llamarAjax("usuarios_ajax.php",_f,"div_documento_existe","");}}};jQuery.validator.addMethod("usuarioexistente",function(_10,_11,_12){var _13=$("#hdd_usuario_existe").val();if(_13=="true"){return true;}else{return false;}},"El usuario ya esxite");jQuery.validator.addMethod("documentoexistente",function(_14,_15,_16){var _17=$("#hdd_documento_existe").val();if(_17=="true"){return true;}else{return false;}},"El Documento ya esxite");function validar_crear_usuarios(){$("#frm_usuarios").validate({rules:{cmb_tipo_documento:{required:true,},txt_numero_documento:{required:true,alphanumeric:true,documentoexistente:true},txt_clave:{required:true,minlength:6,alphanumeric:true},txt_usuario:{required:true,minlength:6,alphanumeric:true,usuarioexistente:true}},messages:{txt_clave:{alphanumeric:"Solo se permite numeros y letras"},txt_usuario:{alphanumeric:"Solo se permite numeros y letras"},txt_numero_documento:{alphanumeric:"Solo se permite numeros y letras"}},submitHandler:function(){var _18=new Array();$("input[name='check_pefiles']:checked").each(function(){_18.push($(this).val());});if(_18==""){$("#contenedor_error").css("display","block");$("#contenedor_error").html("Debe seleccionar al menos un perfil");return false;}else{crear_usuarios();}},});};function validar_editar_usuarios(){$("#frm_usuarios").validate({rules:{cmb_tipo_documento:{required:true,},txt_numero_documento:{required:true,alphanumeric:true,documentoexistente:true}},messages:{txt_numero_documento:{alphanumeric:"Solo se permite numeros y letras"}},submitHandler:function(){var _19=new Array();$("input[name='check_pefiles']:checked").each(function(){_19.push($(this).val());});if(_19==""){$("#contenedor_error").css("display","block");$("#contenedor_error").html("Debe seleccionar al menos un perfil");return false;}else{mostrar_formulario_flotante(1);reducir_formulario_flotante(400,250);posicionarDivFlotante("d_centro");confirmar_guardar();}},});};function validar_exito(){var _1a=$("#hdd_exito").val();$(".formulario").css("display","none");if(_1a>0){$("#contenedor_exito").css("display","block");$("#contenedor_exito").html("Datos guardados correctamente");setTimeout("$('#contenedor_exito').slideUp(200).css('display', 'none')",5000);}else{$("#contenedor_error").css("display","block");$("#contenedor_error").html("Error al guardar usuarios");setTimeout("$('#contenedor_error').slideUp(200).css('display', 'none')",5000);}};function volver_inicio(){if($("#txt_busca_usuario").val()!=""){buscar_usuarios();}else{ver_todos_usuarios();}};function crear_usuarios(){var _1b=$("#txt_nombre_usuario").val();var _1c=$("#txt_apellido_usuario").val();var _1d=$("#cmb_tipo_documento").val();var _1e=$("#txt_numero_documento").val();var _1f=$("#txt_usuario").val();var _20=$("#txt_clave").val();var _21=new Array();$("input[name='check_pefiles']:checked").each(function(){_21.push($(this).val());});var _22="opcion=4&txt_nombre_usuario="+_1b+"&txt_apellido_usuario="+_1c+"&cmb_tipo_documento="+_1d+"&txt_numero_documento="+_1e+"&txt_usuario="+_1f+"&txt_clave="+_20+"&array_perfiles="+_21;llamarAjax("usuarios_ajax.php",_22,"principal_usuarios","validar_exito(); volver_inicio()");};function editar_usuarios(){var _23=$("#txt_nombre_usuario").val();var _24=$("#txt_apellido_usuario").val();var _25=$("#cmb_tipo_documento").val();var _26=$("#txt_numero_documento").val();var _27=$("#hdd_id_usuario").val();var _28=$("#check_estado").is(":checked")?1:0;var _29=new Array();$("input[name='check_pefiles']:checked").each(function(){_29.push($(this).val());});var _2a="opcion=6&txt_nombre_usuario="+_23+"&txt_apellido_usuario="+_24+"&cmb_tipo_documento="+_25+"&txt_numero_documento="+_26+"&array_perfiles="+_29+"&hdd_id_usuario="+_27+"&check_estado="+_28;llamarAjax("usuarios_ajax.php",_2a,"principal_usuarios","cerrar_div_centro(); validar_exito(); volver_inicio()");};function seleccionar_usuarios(_2b){var _2c="opcion=2&id_usuario="+_2b;llamarAjax("usuarios_ajax.php",_2c,"principal_usuarios","mostrar_formulario(1);");};function confirmar_guardar(){$("#d_interno").html("<table border=\"0\" cellpadding=\"5\" cellspacing=\"0\" align=\"center\" style=\"width:100%\">"+"<tr>"+"<th align=\"center\">"+"<h4>&iquest;Est&aacute; seguro de guardar esta informaci&oacute;n?</h4>"+"</th>"+"</tr>"+"<tr>"+"<th align=\"center\">"+"<input type=\"button\" id=\"btn_cancelar_si\" nombre=\"btn_cancelar_si\" class=\"btnPrincipal\" value=\"Aceptar\" onclick=\"editar_usuarios();\"/>\n"+"<input type=\"button\" id=\"btn_cancelar_no\" nombre=\"btn_cancelar_no\" class=\"btnSecundario\" value=\"Cancelar\" onclick=\"cerrar_div_centro();\"/> "+"</th>"+"</tr>"+"</table>");};function resetear_pass(_2d){if(confirm("La contrase?a del usuario: "+_2d+" sera reemplazada por: "+_2d+" ??Realmente desea realizar la acci?n?")){var _2e=$("#hdd_id_usuario").val();var _2f="opcion=7&id_usuario="+_2e;llamarAjax("usuarios_ajax.php",_2f,"rtaResetearPass","postResetearPass();");}};function postResetearPass(){var _30=$("#rtaResetearPass").text();if(_30=="1"){$("#contenedor_exito").css({"display":"block"});$("#contenedor_exito").html("La contrase?a ha sido reseteada");}else{$("#contenedor_error").css({"display":"block"});$("#contenedor_error").html("Error al intentar resetear la contrase?a. Vuelve a intentarlo");}};