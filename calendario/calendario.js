var mes_seleccionado="";var anio_seleccionado="";function calendario(_1,_2){mes_seleccionado=_1;anio_seleccionado=_2;var _3="opcion=1&mes="+_1+"&anio="+_2;llamarAjax("calendario_ajax.php",_3,"d_calendario","");document.getElementById("d_calendario").style.display="block";};function calendario_base(){calendario(mes_seleccionado,anio_seleccionado);};function modificar_calendario(_4,_5){var _6="opcion=2&fecha="+_4+"&ind_laboral="+_5;llamarAjax("calendario_ajax.php",_6,"d_interno","confirmar_modificar_calendario()");};function confirmar_modificar_calendario(){var _7=-1;if(isObject(document.getElementById("hdd_modificar_calendario"))){_7=parseInt($("#hdd_modificar_calendario").val(),10);}if(_7>0){$("#contenedor_exito").css("display","block");$("#contenedor_exito").html("Datos guardados correctamente");}else{$("#contenedor_error").css("display","block");$("#contenedor_error").html("Error al guardar el d&iacute;a");}mostrar_formulario_flotante(1);setTimeout("mostrar_formulario_flotante(0)",1000);calendario_base();};