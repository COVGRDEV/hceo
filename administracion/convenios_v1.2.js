$(document).ready(function() {
    //Carga el listado de convenios
    muestra_convenios();
});

function muestra_convenios() {
    $("#contenedor_error").css("display", "none"); //Oculta el mensaje de error en caso de estar visible

    //Limpia el input
    $("#txtParametro").val("");

    var params = "opcion=1&parametro=-5";
	
    llamarAjax("convenios_ajax.php", params, "principal_convenios", "");
}

//Funcion que busca un convenio especifico
function buscarConvenio() {
    $("#frmBuscarConvenio").validate({
        rules: {
            txtParametro: {
                required: true,
            },
        },
        submitHandler: function() {
            var parametro = $("#txtParametro").val();
            var params = "opcion=1&parametro=" + parametro;
			
            llamarAjax("convenios_ajax.php", params, "principal_convenios", "");
            return false;
        },
    });
}

//Funcion que imprime el formulario para nuevo convenio
function formNuevoConvenio(parametro) {
    var params = "opcion=2&parametro=" + parametro;
	
    llamarAjax("convenios_ajax.php", params, "principal_convenios", "");
}

function guardaModificaConvenio(parametro) {
    $("#frmNuevoConvenio").validate({
        rules: {
            txtNombre: {
                required: true,
            },
            txtCodAdministradora: {
                maxlength: 6,
            },
        },
        submitHandler: function() {
            var nombre = str_encode($("#txtNombre").val());
            var txtCodAdministradora = $("#txtCodAdministradora").val();
			var cmbTipoDocumento = $("#cmbTipoDocumento").val();
			var txtNumeroDocumento = str_encode($("#txtNumeroDocumento").val());
            var indActivo = $("#indActivo").is(":checked") ? 1 : 0;
            var idConvenio = $("#idConvenio").val();
            var idEco = $("#indEco").is(":checked") ? 1 : 0;
            var indNumAut = $("#indNumAut").is(":checked") ? 1 : 0;
            var indNumAutObl = $("#indNumAutObl").is(":checked") ? 1 : 0;
            var indNumCarnet = $("#indNumCarnet").is(":checked") ? 1 : 0;
            var indNumCarnetObl = $("#indNumCarnetObl").is(":checked") ? 1 : 0;
			
            //Hay Planes agregados?
            var filas = $("#tablaPlanes tr").length;
            
            if (filas >= "3") {
				var params = "opcion=3&parametro=" + parametro + "&nombre=" + nombre +
							 "&cmbTipoDocumento=" + cmbTipoDocumento + "&txtNumeroDocumento=" + txtNumeroDocumento +
							 "&indActivo=" + indActivo + "&idConvenio=" + idConvenio +
							 "&idEco=" + idEco + "&txtCodAdministradora=" + txtCodAdministradora +
							 "&indNumAut=" + indNumAut + "&indNumAutObl=" + indNumAutObl +
							 "&indNumCarnet=" + indNumCarnet + "&indNumCarnetObl=" + indNumCarnetObl;
				
                if ($("#tablaPlanesNull").is(":visible")) { //verifica que el tr con el mensaje: No hay registros, no esta.
                    //Guarda el convenio sin plan.
                    llamarAjax("convenios_ajax.php", params, "hdd_resultado", "verificaGuardar();");
                } else {
                    //Guarda el convenio y despues recorre la tabla planes para guardar los planes
                    llamarAjax("convenios_ajax.php", params, "hdd_resultado", "verificaGuardarPlanes();");
                }
            }
            return false;
        },
    });
}

//Funcion que guarda los planes despues se guardar el convenio.
function verificaGuardarPlanes() {
    var myArray = [];
    var filas = $("#tablaPlanes tr").length; //Lista los planes agregados

    var nomrbePlan = "";
    var tipoPago = "";
    var estado = "";

    for (i = 2; i <= (filas - 1); i++) {
        myArray[0] = $("#tablaPlanes tr:eq(" + i + ") td:eq(1)").text();
        myArray[1] = $("#tablaPlanes tr:eq(" + i + ") td:eq(2)").attr("id");
        myArray[2] = $("#tablaPlanes tr:eq(" + i + ") td:eq(3)").attr("id");

        var params = "opcion=5&txtNombrePlan=" + myArray[0] + "&tipoPago=" + myArray[1] + "&indActivoPlan=" + myArray[2] + "&idConvenio=0&tipoAccion=1&idPlan=0";
        llamarAjax("convenios_ajax.php", params, "", "");
    }
    verificaGuardar();

}

function verificaGuardar() {
    var resultado = $("#hdd_resultado").text();

    if (resultado == "1") {
        $("#contenedor_exito").css("display", "block");
        $("#contenedor_exito").html("El registro ha sido guardado");
        
        muestra_convenios();
        
        setTimeout(function() {
            $("#contenedor_exito").css("display", "none");
        }, 5000);
    } else if (resultado == "-1") {
        $("#contenedor_error").css("display", "block");
        $("#contenedor_error").html("Se ha producido un error. vuelva a intentarlo");
    }
}

function seleccionar_convenio(idConvenio, parametro) {
    var params = "opcion=2&parametro=" + parametro + "&idConvenio=" + idConvenio;
    llamarAjax("convenios_ajax.php", params, "principal_convenios", "");
}

//Guarda los planes
function agregar_plan(idPlanA) {
    $("#frmAgregarPlan").validate({
        rules: {
            txtNombrePlan: {
                required: true,
            },
            cmb_tipoPago: {
                required: true,
            },
            cmb_tipo_usuario: {
                required: true,
            },
        },
        submitHandler: function() {

            var idConvenio = $("#idConvenio").val();
            var txtNombrePlan = $("#txtNombrePlan").val();
            var tipoPago = $("#cmb_tipoPago").val();
			var codTipoMedicamento = $("#cmb_tipo_medicamento").val();
            var indActivoPlan = $("#indActivoPlan").is(":checked") ? 1 : 0;
            var tipoAccion = 0;
            var tipoUsuario = $("#cmb_tipo_usuario").val();

            if (idConvenio != "0") {
                if(idPlanA == 0){
                    tipoAccion = 1;//Crea nuevo plan
                }
                else if(idPlanA != 0){
                    tipoAccion = 2;//Actualiza el plan
                }
                
                var params = "opcion=5&idConvenio=" + idConvenio +
							 "&idPlan=" + idPlanA +
							 "&tipoAccion=" + tipoAccion +
							 "&txtNombrePlan=" + txtNombrePlan +
							 "&tipoPago=" + tipoPago +
							 "&indActivoPlan=" + indActivoPlan +
							 "&tipoUsuario=" + tipoUsuario +
							 "&codTipoMedicamento=" + codTipoMedicamento;
				
                llamarAjax("convenios_ajax.php", params, "hdd_resultadoPlanes", "verificaGuardaPlan();");//verificaGuardaPlan();
            } else if (idConvenio == "0") {
                //Procesa el mensaje de: Activo / No Activo
                var estado_decodificado = "";
                var class_estado = "";
                if (indActivoPlan == "1") {
                    estado_decodificado = "Activo";
                    class_estado = "activo";
                } else if (indActivoPlan == "0") {
                    estado_decodificado = "No Activo";
                    class_estado = "inactivo";
                }
				
                //Imprime el registro en la tabla
                var idPlan = 0;
                idPlan = Math.floor(Math.random() * (75-25+1)) + 25;
                $("#tablaPlanesNull").remove();//Elimina el mensaje de: no hay resultados
                $("#tablaPlanes").append(
					'<tr id="' + idPlan + '" onclick="edicionPlan(0);">' +
						'<td>No definido</td>' +
						'<td>' + txtNombrePlan + '</td>' +
						'<td id="' + tipoPago + '">' + $('#cmb_tipoPago option:selected').text() + '</td>' +
						'<td id="' + indActivoPlan + '"><span class="' + class_estado + '">' + estado_decodificado + '</span></td>' +
						'<td><img onclick="removerPlanTmp('+idPlan+')" src="../imagenes/Error-icon.png" /></td>' +
					'</tr>');
                
				ventanaAgregarPlan(0,0); //Oculta la venatan flotante
            }
            return false;
        },
    });
}

//Verifica que Guardo 
function verificaGuardaPlan() {
    var resultado = $("#hdd_resultadoPlanes").text();

    if (resultado == "-1") {
        $("#contenedor_error").css("display", "block");
        $("#contenedor_error").html("Se ha producido un error. vuelva a intentarlo");
    }
    else if (resultado != "-1") {//Cierra la ventana flotante y Actualiza el listado de planes
        var parametro = 1;
        var idConvenio = $("#idConvenio").val();
        ventanaAgregarPlan(0,0);
        seleccionar_convenio(idConvenio, parametro);
    }
}

//Verifica que Guardo 
function edicionPlan(idPlan) {
    if (idPlan == "0") {
        //alert("No definido");
    } else if (idPlan != "0") {
        ventanaAgregarPlan(1, idPlan);
    }
}

//Muestra la venatan flotante de agregar Planes
function ventanaAgregarPlan(tipo, idPlan) {
    if (tipo == 1) { //mostrar
        $("#contenedor_error").remove();//Elimina el div de error que esta detras del elemento flotante
        $("#fondo_negro").css("display", "block");
        $("#d_centro").slideDown(400).css("display", "block");

        $("#a_cierre_panel").remove();//Eliminar el icono cerrar que trae por defecto el div flotante

        //Se agrega un nuevo icnono de cerrar ventana, el cual tiene una nueva funcion.
        $("#d_centro").prepend('<a name="a_cierre_panel2" id="a_cierre_panel2" href="#" onclick="ventanaAgregarPlan(0);"></a>');

        //Envia por ajax la peticion para construir el formulario flotante
        var idConvenio = $("#idConvenio").val();
        var params = "opcion=4&idConvenio=" + idConvenio + "&idPlan="+idPlan;
		
        llamarAjax("convenios_ajax.php", params, "d_interno", "");

        posicionarDivFlotante("d_centro");
    } else if (tipo == 0) { //Ocultar
        $("#a_cierre_panel2").remove();//Elimina el el icono cerrar ventana agregado en las lineas de arriba
        $("#d_centro").css("display", "none");
        $("#fondo_negro").css("display", "none");

        $("#advertenciasg").prepend('<div class="contenedor_error" id="contenedor_error"></div>');//Agreba el div de error al conteendor
    }
}

function removerPlanTmp(id){
    //El n??mero de filas de la tabla con id: tablaPrecios
    var filas = $("#tablaPlanes tr").length;
	
    //Elimina la fila: no hay resultados en la tabla con id: tablaPrecios
    $("#" + id).remove();
	
    //Agrega el mensaje: no hay resultados en la tabla con id: tablaPrecios
    if (filas <= 3) {
        $("#tablaPlanes").append("<tr id='tablaPlanesNull'><td colspan=\"5\">No hay resultados</td></tr>");
    }
}
