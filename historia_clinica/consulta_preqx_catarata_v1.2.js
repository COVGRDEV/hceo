var imagen_queratometria_od=imagen_queratometria_od||{};imagen_queratometria_od.GuardandoPNGs=(function(){var _1=false;var _2,_3;var _4;var _5=0;function _6(){return _5;};function _7(){var _8=document.getElementById("canvas_queratometria_od");_4=_8.getContext("2d");_9();document.getElementById("btn_save_queratometria_od").onmouseup=_a;document.getElementById("btn_clear_queratometria_od").onmouseup=_9;_8.onmousedown=function(e){_b(e.layerX,e.layerY);_1=true;};_8.onmousemove=function(e){if(_1){_b(e.layerX,e.layerY);}};_8.onmouseup=function(e){_1=false;};_8.onmouseleave=function(e){_1=false;};};function _b(x,y){if(_1){_4.beginPath();_4.strokeStyle=document.getElementById("color_queratometria_od").value;if(document.getElementById("color_queratometria_od").value=="#ffffff"||document.getElementById("color_queratometria_od").value=="#FFFFFF"){_4.lineWidth=10;}else{_4.lineWidth=2;}_4.lineJoin="round";_4.moveTo(_2,_3);_4.lineTo(x,y);_4.closePath();_4.stroke();_5=1;}_2=x;_3=y;};function _a(){var _c=document.getElementById("canvas_queratometria_od");var _d=document.getElementById("hdd_id_hc_consulta").value;var _e=document.getElementById("hdd_id_paciente").value;var _f=new Image();_f.src="../imagenes/queratometria_img.png";_4.drawImage(_f,1,1);var _10="queratometriaod|"+_e+"|"+_d+"|"+_c.toDataURL("../imagenes/hc_temporal");var xhr=new XMLHttpRequest();xhr.onreadystatechange=function(){if(xhr.readyState==4){document.getElementById("hdd_img_queratometria_od").value=xhr.responseText;}};xhr.open("POST","../historia_clinica/guardar_img_oftalmologia.php",true);xhr.setRequestHeader("Content-Type","application/upload");xhr.send(_10);};function _9(){var _11=document.getElementById("canvas_queratometria_od");_4=_11.getContext("2d");_4.fillStyle="#ffffff";_4.fillRect(0,0,_11.width,_11.height);var img=new Image();var _12=document.getElementById("hdd_img_queratometria_od").value;if(_12==""){img.src="../imagenes/queratometria_img.png";}else{img.src=_12;}_4.drawImage(img,1,1);};return {"init_queratometria_od":_7,"resetCanvasQueratometria_od":_9,"sendToServerQueratometria_od":_a,"get_modificado":_6};});var imagen_queratometria_oi=imagen_queratometria_oi||{};imagen_queratometria_oi.GuardandoPNGs=(function(){var _13=false;var _14,_15;var ctx;var _16=0;function _17(){return _16;};function _18(){var _19=document.getElementById("canvas_queratometria_oi");ctx=_19.getContext("2d");_1a();document.getElementById("btn_save_queratometria_oi").onmouseup=_1b;document.getElementById("btn_clear_queratometria_oi").onmouseup=_1a;_19.onmousedown=function(e){_1c(e.layerX,e.layerY);_13=true;};_19.onmousemove=function(e){if(_13){_1c(e.layerX,e.layerY);}};_19.onmouseup=function(e){_13=false;};_19.onmouseleave=function(e){_13=false;};};function _1c(x,y){if(_13){ctx.beginPath();ctx.strokeStyle=document.getElementById("color_queratometria_oi").value;if(document.getElementById("color_queratometria_oi").value=="#ffffff"||document.getElementById("color_queratometria_oi").value=="#FFFFFF"){ctx.lineWidth=10;}else{ctx.lineWidth=2;}ctx.lineJoin="round";ctx.moveTo(_14,_15);ctx.lineTo(x,y);ctx.closePath();ctx.stroke();_16=1;}_14=x;_15=y;};function _1b(){var _1d=document.getElementById("canvas_queratometria_oi");var _1e=document.getElementById("hdd_id_hc_consulta").value;var _1f=document.getElementById("hdd_id_paciente").value;var img=new Image();img.src="../imagenes/queratometria_img.png";ctx.drawImage(img,1,1);var _20="queratometriaoi|"+_1f+"|"+_1e+"|"+_1d.toDataURL("../imagenes/hc_temporal");var xhr=new XMLHttpRequest();xhr.onreadystatechange=function(){if(xhr.readyState==4){document.getElementById("hdd_img_queratometria_oi").value=xhr.responseText;}};xhr.open("POST","../historia_clinica/guardar_img_oftalmologia.php",true);xhr.setRequestHeader("Content-Type","application/upload");xhr.send(_20);};function _1a(){var _21=document.getElementById("canvas_queratometria_oi");ctx=_21.getContext("2d");ctx.fillStyle="#ffffff";ctx.fillRect(0,0,_21.width,_21.height);var img=new Image();var _22=document.getElementById("hdd_img_queratometria_oi").value;if(_22==""){img.src="../imagenes/queratometria_img.png";}else{img.src=_22;}ctx.drawImage(img,1,1);};return {"init_queratometria_oi":_18,"resetCanvasQueratometria_oi":_1a,"sendToServerQueratometria_oi":_1b,"get_modificado":_17};});var obj_imagen_queratometria_od;var obj_imagen_queratometria_oi;window.onload=function(){if(bol_od==true){obj_imagen_queratometria_od=new imagen_queratometria_od.GuardandoPNGs();obj_imagen_queratometria_od.init_queratometria_od();}if(bol_oi==true){obj_imagen_queratometria_oi=new imagen_queratometria_oi.GuardandoPNGs();obj_imagen_queratometria_oi.init_queratometria_oi();}};function borrar_img_queratometria_od(){document.getElementById("color_queratometria_od").value="#FFFFFF";};function borrar_img_queratometria_oi(){document.getElementById("color_queratometria_oi").value="#FFFFFF";};function mostrar_formulario_flotante(_23){if(_23==1){$("#fondo_negro").css("display","block");$("#d_centro").slideDown(400).css("display","block");}else{if(_23==0){$("#fondo_negro").css("display","none");$("#d_centro").slideDown(400).css("display","none");}}};function reducir_formulario_flotante(_24,_25){$(".div_centro").width(_24);$(".div_centro").height(_25);$(".div_centro").css("top","20%");$(".div_interno").width(_24-15);$(".div_interno").height(_25-35);};function validar_array(_26,id){var _27=$(id).val();var _28=0;for(var i=0;i<_26.length;i++){if(_27==_26[i]){_28=1;break;}}if(_27==""){_28=1;}if(_28==0){alert("Valor incorrecto");document.getElementById(id.id).value="";input=id.id;setTimeout("document.getElementById(input).focus()",75);}};function validar_array_locs3(_29){var _2a=$("#cmb_locs3").val();switch(_2a){case "111":validar_array(array_locs3_no,_29);break;case "112":validar_array(array_locs3_nc,_29);break;case "113":validar_array(array_locs3_c,_29);break;case "114":validar_array(array_locs3_scp,_29);break;}};function mostrar_formulario(_2b){if(_2b==1){$(".formulario").slideDown(600).css("display","block");}else{if(_2b==0){$(".formulario").slideUp(600).css("display","none");}}};function guardar_consulta(_2c,_2d){switch(_2c){case 1:case 3:$("#frm_consulta").validate({submitHandler:function(){$("#contenedor_error").css("display","none");if(validar_consulta()){editar_consulta(_2c);}else{$("#contenedor_error").css("display","block");$("#contenedor_error").html("Los campos marcados en rojo son obligatorios");}return false;},});break;case 2:editar_consulta(_2c);break;}if(_2d==1){setTimeout("imprimir_consulta()",1000);}};function imprimir_consulta(){var _2e="id_hc="+$("#hdd_id_hc_consulta").val();llamarAjax("../historia_clinica/impresion_historia_clinica.php",_2e,"d_impresion_hc","imprSelec(\"d_impresion_hc\")");};function validar_consulta(){var _2f=true;var _30=0;var _31=0;var _32=0;var _33=0;var _34=0;$("#panel_cata_1").removeClass("borde_error_panel");$("#panel_cata_1 a").css({"color":"#5B5B5B"});$("#panel_cata_2").removeClass("borde_error_panel");$("#panel_cata_2 a").css({"color":"#5B5B5B"});$("#panel_cata_3").removeClass("borde_error_panel");$("#panel_cata_3 a").css({"color":"#5B5B5B"});$("#panel_cata_4").removeClass("borde_error_panel");$("#panel_cata_4 a").css({"color":"#5B5B5B"});$("#panel_cata_5").removeClass("borde_error_panel");$("#panel_cata_5 a").css({"color":"#5B5B5B"});$("#cmb_locs3").removeClass("bordeAdmision");$("#txt_val_locs3").removeClass("bordeAdmision");$("#txt_val_rec_endotelial").removeClass("bordeAdmision");$("#txt_val_paquimetria").removeClass("bordeAdmision");$("#cmb_plegables").removeClass("bordeAdmision");$("#cmb_rigido").removeClass("bordeAdmision");$("#cmb_especiales").removeClass("bordeAdmision");$("#txt_evolucion").removeClass("bordeAdmision");$("#cmb_anestesia").removeClass("bordeAdmision");$("#txt_q_val_biometria_od").removeClass("bordeAdmision");$("#txt_q_eje_biometria_od").removeClass("bordeAdmision");$("#txt_q_val_iol_master_od").removeClass("bordeAdmision");$("#txt_q_eje_iol_master_od").removeClass("bordeAdmision");$("#txt_q_val_topografia_od").removeClass("bordeAdmision");$("#txt_q_eje_topografia_od").removeClass("bordeAdmision");$("#txt_q_val_definitiva_od").removeClass("bordeAdmision");$("#txt_q_eje_definitiva_od").removeClass("bordeAdmision");$("#txt_q_val_biometria_oi").removeClass("bordeAdmision");$("#txt_q_eje_biometria_oi").removeClass("bordeAdmision");$("#txt_q_val_iol_master_oi").removeClass("bordeAdmision");$("#txt_q_eje_iol_master_oi").removeClass("bordeAdmision");$("#txt_q_val_topografia_oi").removeClass("bordeAdmision");$("#txt_q_eje_topografia_oi").removeClass("bordeAdmision");$("#txt_q_val_definitiva_oi").removeClass("bordeAdmision");$("#txt_q_eje_definitiva_oi").removeClass("bordeAdmision");$("#hdd_img_queratometria_od").removeClass("bordeAdmision");$("#hdd_img_queratometria_oi").removeClass("bordeAdmision");$("#cmb_incision_arq").removeClass("bordeAdmision");$("#txt_val_incision_arq").removeClass("bordeAdmision");$("#txt_observaciones_preqx").removeClass("bordeAdmision");$("#ciex_diagnostico_1").removeClass("bordeAdmision");$("#valor_ojos_1").removeClass("bordeAdmision");var _35=$("#lista_tabla").val();for(i=1;i<=_35;i++){$("#valor_ojos_"+i).removeClass("bordeAdmision");}if($("#hdd_ciex_diagnostico_1").val()==""){$("#ciex_diagnostico_1").addClass("bordeAdmision");_2f=false;_34=1;}if($("#valor_ojos_1").val()==""){$("#valor_ojos_1").addClass("bordeAdmision");_2f=false;_34=1;}for(i=1;i<=_35;i++){var _36=$("#hdd_ciex_diagnostico_"+i).val();var _37=$("#valor_ojos_"+i).val();if(_36!=""&&_37==""){$("#valor_ojos_"+i).addClass("bordeAdmision");_2f=false;_34=1;}}if($("#cmb_locs3").val()==""){$("#cmb_locs3").addClass("bordeAdmision");_2f=false;_30=1;}if($("#txt_val_locs3").val()==""){$("#txt_val_locs3").addClass("bordeAdmision");_2f=false;_30=1;}if($("#txt_val_rec_endotelial").val()==""){$("#txt_val_rec_endotelial").addClass("bordeAdmision");_2f=false;_30=1;}if($("#txt_val_paquimetria").val()==""){$("#txt_val_paquimetria").addClass("bordeAdmision");_2f=false;_30=1;}if($("#cmb_plegables").val()==""&&$("#cmb_rigido").val()==""&&$("#cmb_especiales").val()==""){$("#cmb_plegables").addClass("bordeAdmision");$("#cmb_rigido").addClass("bordeAdmision");$("#cmb_especiales").addClass("bordeAdmision");_2f=false;_30=1;}if($("#txt_evolucion").val()==""){$("#txt_evolucion").addClass("bordeAdmision");_2f=false;_31=1;}if($("#cmb_anestesia").val()==""){$("#cmb_anestesia").addClass("bordeAdmision");_2f=false;_31=1;}if(bol_od){if($("#txt_q_val_biometria_od").val()==""){$("#txt_q_val_biometria_od").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_eje_biometria_od").val()==""){$("#txt_q_eje_biometria_od").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_val_iol_master_od").val()==""){$("#txt_q_val_iol_master_od").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_eje_iol_master_od").val()==""){$("#txt_q_eje_iol_master_od").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_val_topografia_od").val()==""){$("#txt_q_val_topografia_od").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_eje_topografia_od").val()==""){$("#txt_q_eje_topografia_od").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_val_definitiva_od").val()==""){$("#txt_q_val_definitiva_od").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_eje_definitiva_od").val()==""){$("#txt_q_eje_definitiva_od").addClass("bordeAdmision");_2f=false;_32=1;}}if(bol_oi){if($("#txt_q_val_biometria_oi").val()==""){$("#txt_q_val_biometria_oi").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_eje_biometria_oi").val()==""){$("#txt_q_eje_biometria_oi").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_val_iol_master_oi").val()==""){$("#txt_q_val_iol_master_oi").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_eje_iol_master_oi").val()==""){$("#txt_q_eje_iol_master_oi").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_val_topografia_oi").val()==""){$("#txt_q_val_topografia_oi").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_eje_topografia_oi").val()==""){$("#txt_q_eje_topografia_oi").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_val_definitiva_oi").val()==""){$("#txt_q_val_definitiva_oi").addClass("bordeAdmision");_2f=false;_32=1;}if($("#txt_q_eje_definitiva_oi").val()==""){$("#txt_q_eje_definitiva_oi").addClass("bordeAdmision");_2f=false;_32=1;}}if($("#cmb_incision_arq").val()==""){$("#cmb_incision_arq").addClass("bordeAdmision");_2f=false;_32=1;}if($("#cmb_incision_arq").val()=="1"&&$("#txt_val_incision_arq").val()==""){$("#txt_val_incision_arq").addClass("bordeAdmision");_2f=false;_32=1;}if(_30==1){$("#panel_cata_1").addClass("borde_error_panel");$("#panel_cata_1 a").css({"color":"#FF002A"});}if(_31==1){$("#panel_cata_2").addClass("borde_error_panel");$("#panel_cata_2 a").css({"color":"#FF002A"});}if(_32==1){$("#panel_cata_3").addClass("borde_error_panel");$("#panel_cata_3 a").css({"color":"#FF002A"});}if(_33==1){$("#panel_cata_4").addClass("borde_error_panel");$("#panel_cata_4 a").css({"color":"#FF002A"});}if(_34==1){$("#panel_cata_5").addClass("borde_error_panel");$("#panel_cata_5 a").css({"color":"#FF002A"});}return _2f;};function editar_consulta(_38){guardar_imagenes();var _39="opcion=1&id_hc="+$("#hdd_id_hc_consulta").val()+"&id_admision="+$("#hdd_id_admision").val()+"&id_paciente="+$("#hdd_id_paciente").val()+"&id_locs3="+$("#cmb_locs3").val()+"&val_locs3="+$("#txt_val_locs3").val()+"&val_rec_endotelial="+$("#txt_val_rec_endotelial").val()+"&val_paquimetria="+$("#txt_val_paquimetria").val()+"&id_plegables="+$("#cmb_plegables").val()+"&id_rigido="+$("#cmb_rigido").val()+"&id_especiales="+$("#cmb_especiales").val()+"&texto_evolucion="+str_encode($("#txt_evolucion").val())+"&id_anestesia="+$("#cmb_anestesia").val()+"&querato_val_biometria_od="+$("#txt_q_val_biometria_od").val()+"&querato_eje_biometria_od="+$("#txt_q_eje_biometria_od").val()+"&querato_val_iol_master_od="+$("#txt_q_val_iol_master_od").val()+"&querato_eje_iol_master_od="+$("#txt_q_eje_iol_master_od").val()+"&querato_val_topografia_od="+$("#txt_q_val_topografia_od").val()+"&querato_eje_topografia_od="+$("#txt_q_eje_topografia_od").val()+"&querato_val_definitiva_od="+$("#txt_q_val_definitiva_od").val()+"&querato_eje_definitiva_od="+$("#txt_q_eje_definitiva_od").val()+"&querato_val_biometria_oi="+$("#txt_q_val_biometria_oi").val()+"&querato_eje_biometria_oi="+$("#txt_q_eje_biometria_oi").val()+"&querato_val_iol_master_oi="+$("#txt_q_val_iol_master_oi").val()+"&querato_eje_iol_master_oi="+$("#txt_q_eje_iol_master_oi").val()+"&querato_val_topografia_oi="+$("#txt_q_val_topografia_oi").val()+"&querato_eje_topografia_oi="+$("#txt_q_eje_topografia_oi").val()+"&querato_val_definitiva_oi="+$("#txt_q_val_definitiva_oi").val()+"&querato_eje_definitiva_oi="+$("#txt_q_eje_definitiva_oi").val()+"&img_queratometria_od="+$("#hdd_img_queratometria_od").val()+"&img_queratometria_oi="+$("#hdd_img_queratometria_oi").val()+"&ind_incision_arq="+$("#cmb_incision_arq").val()+"&val_incision_arq="+$("#txt_val_incision_arq").val()+"&observaciones_preqx="+str_encode($("#txt_observaciones_preqx").val())+"&diagnostico_preqx_catarata="+str_encode($("#diagnostico_preqx_catarata").val())+"&solicitud_examenes_preqx_catarata="+str_encode($("#solicitud_examenes_preqx_catarata").val())+"&tratamiento_preqx_catarata="+str_encode($("#tratamiento_preqx_catarata").val())+"&medicamentos_preqx_catarata="+str_encode($("#medicamentos_preqx_catarata").val())+"&tipo_guardar="+_38;if(bol_od==true){_39+="&img_queratometria_od_modificado="+obj_imagen_queratometria_od.get_modificado();}else{_39+="&img_queratometria_od_modificado=0";}if(bol_oi==true){_39+="&img_queratometria_oi_modificado="+obj_imagen_queratometria_oi.get_modificado();}else{_39+="&img_queratometria_oi_modificado=0";}var _3a=$("#lista_tabla").val();_39+="&cant_ciex="+_3a;for(i=1;i<=_3a;i++){var _3b=$("#hdd_ciex_diagnostico_"+i).val();var _3c=$("#valor_ojos_"+i).val();if(_3b!=""){_39+="&cod_ciex_"+i+"="+_3b+"&val_ojos_"+i+"="+_3c;}}llamarAjax("consulta_preqx_catarata_ajax.php",_39,"d_guardar_consulta","validar_exito()");};function validar_exito(){var _3d=$("#hdd_exito").val();var _3e=$("#hdd_url_menu").val();var _3f=$("#hdd_tipo_guardar").val();if(_3f==1){if(_3d>0){$("#frm_consulta").css("display","none");$("#contenedor_exito").css("display","block");$("#contenedor_exito").html("Datos guardados correctamente");setTimeout("enviar_credencial('"+_3e+"')",3000);}else{$("#contenedor_error").css("display","block");$("#contenedor_error").html("Error al guardar la evoluci&oacute;n");}}else{if(_3f==2){if(_3d>0){$("#contenedor_exito").css("display","block");$("#contenedor_exito").html("Datos guardados correctamente");setTimeout("$(\"#contenedor_exito\").css(\"display\", \"none\")",3000);}else{$("#contenedor_error").css("display","block");$("#contenedor_error").html("Error al guardar la evoluci&oacute;n");}}else{if(_3f==3){if(_3d>0){$("#contenedor_exito").css("display","block");$("#contenedor_exito").html("Datos guardados correctamente");setTimeout("$(\"#contenedor_exito\").css(\"display\", \"none\")",3000);}else{$("#contenedor_error").css("display","block");$("#contenedor_error").html("Error al guardar la evoluci&oacute;n");}}}}window.scrollTo(0,0);};function guardar_imagenes(){if(bol_od==true){if(obj_imagen_queratometria_od.get_modificado()==1){obj_imagen_queratometria_od.sendToServerQueratometria_od();}}if(bol_oi==true){if(obj_imagen_queratometria_oi.get_modificado()==1){obj_imagen_queratometria_oi.sendToServerQueratometria_oi();}}};function cambiar_lista_locs3(_40){$("#txt_val_locs3").val("");$(function(){switch(_40){case "111":$("#txt_val_locs3").autocomplete({source:array_locs3_no});break;case "112":$("#txt_val_locs3").autocomplete({source:array_locs3_nc});break;case "113":$("#txt_val_locs3").autocomplete({source:array_locs3_c});break;case "114":$("#txt_val_locs3").autocomplete({source:array_locs3_scp});break;}});};function seleccionar_incision_arq(_41){switch(_41){case "1":$("#txt_val_incision_arq").attr("disabled",false);if(trim($("#txt_val_paquimetria").val())!=""){var _42=Math.round(parseInt($("#txt_val_paquimetria").val(),10)*0.8);$("#txt_val_incision_arq").val(_42);}break;case "0":$("#txt_val_incision_arq").attr("disabled",true);$("#txt_val_incision_arq").val("");break;}};