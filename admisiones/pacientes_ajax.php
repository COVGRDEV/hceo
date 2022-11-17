<?php
session_start();

header('Content-Type: text/xml; charset=UTF-8');

require_once("../db/DbListas.php");
require_once("../db/DbHistoriaClinica.php");
require_once("../db/DbVariables.php");
require_once("../db/DbPacientes.php");
require_once("../db/DbPaises.php");
require_once("../db/DbDepartamentos.php");
require_once("../db/DbDepMuni.php");
require_once("../funciones/Class_Combo_Box.php");
require_once("../principal/ContenidoHtml.php");
require_once("../funciones/FuncionesPersona.php");
require_once("../funciones/Utilidades.php");
require_once("../funciones/Class_Generar_Clave.php");

$dbListas = new DbListas();
$dbHistoriaClinica = new DbHistoriaClinica();
$dbVariables = new Dbvariables();
$dbPacientes = new DbPacientes();
$dbDepMuni = new DbDepMuni();
$contenido = new ContenidoHtml();
$contenido->validar_seguridad(1);
$funciones_persona = new FuncionesPersona();
$utilidades = new Utilidades();
$combo = new Combo_Box();
$opcion = $utilidades->str_decode($_POST["opcion"]);

function ver_datos_paciente($id_paciente) {
	$dbListas = new DbListas();
	$dbHistoriaClinica = new DbHistoriaClinica();
	$dbVariables = new Dbvariables();
	$dbPacientes = new DbPacientes();
	$dbPaises = new DbPaises();
	$dbDepartamentos = new DbDepartamentos();
	$dbDepMuni = new DbDepMuni();
    $funciones_persona = new FuncionesPersona();
	$utilidades = new Utilidades();
	$contenido = new ContenidoHtml();
	$combo = new Combo_Box();
	$tipo_acceso_menu = $contenido->obtener_permisos_menu($utilidades->str_decode($_POST["hdd_numero_menu"]));
    
	//Se obtienen los datos del paciente
	$paciente_obj = $dbPacientes->getExistepaciente3($id_paciente);
	$id_tipo_documento = $paciente_obj["id_tipo_documento"];
	$numero_documento = $paciente_obj["numero_documento"];
	$nombre_1 = $paciente_obj["nombre_1"];
	$nombre_2 = $paciente_obj["nombre_2"];
	$apellido_1 = $paciente_obj["apellido_1"];
	$apellido_2 = $paciente_obj["apellido_2"];
	$sexo = $paciente_obj["sexo"];
	$id_pais = $paciente_obj["id_pais"];
	$cod_dep = $paciente_obj["cod_dep"];
	$cod_mun = $paciente_obj["cod_mun"];
	$nom_dep = $paciente_obj["nom_dep"];
	$nom_mun = $paciente_obj["nom_mun"];
	$id_zona = $paciente_obj["id_zona"];
	$direccion = $paciente_obj["direccion"];
	$telefono_1 = $paciente_obj["telefono_1"];
	$telefono_2 = $paciente_obj["telefono_2"];
	$email = $paciente_obj["email"];
	$fecha_nacimiento = $paciente_obj["fecha_nacimiento_aux"];
	$id_pais_nac = $paciente_obj["id_pais_nac"];
	$cod_dep_nac = $paciente_obj["cod_dep_nac"];
	$cod_mun_nac = $paciente_obj["cod_mun_nac"];
	$nom_dep_nac = $paciente_obj["nom_dep_nac"];
	$nom_mun_nac = $paciente_obj["nom_mun_nac"];
	$id_estado_civil = $paciente_obj["id_estado_civil"];
	$tipo_sangre = $paciente_obj["tipo_sangre"];
	$factor_rh = $paciente_obj["factor_rh"];
	$ind_desplazado = $paciente_obj["ind_desplazado"];
	$id_etnia = $paciente_obj["id_etnia"];
	$profesion = $paciente_obj["profesion"];
	$observ_paciente = $paciente_obj["observ_paciente"];
	$ind_habeas_data = $paciente_obj["ind_habeas_data"];
	//var_dump($paciente_obj);
	
	$clave_verificacion = $paciente_obj["clave_verificacion"];
	if($clave_verificacion == ''){
		/*Para generar clave del paciente*/
		$clave_paciente = new Class_Generar_Clave();
		$InitalizationKey = $clave_paciente->generate_secret_key(16);
		$TimeStamp = $clave_paciente->get_timestamp();
		$secretkey = $clave_paciente->base32_decode($InitalizationKey);
		$clave_verificacion = $clave_paciente->oath_hotp($secretkey, $TimeStamp);
		
		$dbPacientes->guardar_clave_verificacion($id_paciente, $clave_verificacion);
	}
	
    $id_usuario = $_SESSION["idUsuario"];
    @$credencial = $utilidades->str_decode($_POST["credencial"]);
    @$id_menu = $utilidades->str_decode($_POST["hdd_numero_menu"]);
    ?>
    <input type="hidden" id="hdd_id_paciente" value="<?php echo($id_paciente); ?>" />
    <fieldset style="width: 90%; margin: auto;">
        <legend>Datos del paciente:</legend>
        <table border="0" style="width: 100%; margin: auto; font-size: 10pt;">
            <tr>
                <td align="left" style="width:25%;"><label>Tipo de identificaci&oacute;n*</label></td>
                <td align="left" style="width:25%;"><label>N&uacute;mero de identificaci&oacute;n*</label></td>
				<!-- <td align="left" style="width:25%;"></td>
				<td align="left" style="width:25%;"></td> -->
				<td align="center" colspan="2" rowspan="2" valign="top"><b>C&oacute;digo de verificaci&oacute;n <br /> <?php echo($clave_verificacion); ?> </b></td>
            </tr>
            <tr>
                <td align="left">
                	<?php
						//Se carga la lista de tipos de documento
						$lista_tipos_documento = $dbListas->getListaDetalles(2, 1);
						$combo->getComboDb("cmb_tipo_documento", $id_tipo_documento, $lista_tipos_documento, "id_detalle,nombre_detalle", "", "", 1, "width:100%;");
					?>
                </td>
                <td align="left">
                	<input type="text" id="txt_numero_documento" value="<?php echo($numero_documento); ?>" maxlength="20" style="width:100%;" onblur="trim(this.value);" />
                </td>
				
            </tr>
            <tr>
                <td align="left"><label>Primer nombre*</label></td>
                <td align="left"><label>Segundo nombre</label></td>
                <td align="left"><label>Primer apellido*</label></td>
                <td align="left"><label>Segundo apellido</label></td>
            </tr>
            <tr>
                <td align="left">
                	<input type="text" id="txt_nombre_1" value="<?php echo($nombre_1); ?>" maxlength="100" style="width:100%;" onblur="trim(this.value);" />
                </td>
                <td align="left">
                	<input type="text" id="txt_nombre_2" value="<?php echo($nombre_2); ?>" maxlength="100" style="width:100%;" onblur="trim(this.value);" />
                </td>
                <td align="left">
                	<input type="text" id="txt_apellido_1" value="<?php echo($apellido_1); ?>" maxlength="100" style="width:100%;" onblur="trim(this.value);" />
                </td>
                <td align="left">
                	<input type="text" id="txt_apellido_2" value="<?php echo($apellido_2); ?>" maxlength="100" style="width:100%;" onblur="trim(this.value);" />
                </td>
            </tr>
            <tr>
                <td align="left"><label>G&eacute;nero*</label></td>
                <td align="left"><label>Fecha de nacimiento*</label></td>
                <td align="left"><label>Tipo de sangre*</label></td>
                <td align="left"><label>Factor RH*</label></td>
            </tr>
            <tr>
                <td align="left">
                	<?php
						//Se carga la lista de sexos
						$lista_sexos = $dbListas->getListaDetalles(1, 1);
						$combo->getComboDb("cmb_sexo", $sexo, $lista_sexos, "id_detalle,nombre_detalle", " ", "", 1, "width:100%;");
					?>
                </td>
                <td align="left">
                	<input type="text" class="input" maxlength="10" style="width:120px;" id="txt_fecha_nacimiento" onkeyup="DateFormat(this, this.value, event, false, '3');" onfocus="vDateType = '3';" onBlur="DateFormat(this, this.value, event, true, '3');" value="<?php echo($fecha_nacimiento); ?>" />
					<script id="ajax">
                        $(function() {
                            window.prettyPrint && prettyPrint();
                            $('#txt_fecha_nacimiento').fdatepicker({
                                format: 'dd/mm/yyyy'
                            });
                        });
					</script>
                </td>
                <td align="left">
                	<?php
						$lista_tipos_sangre = $dbListas->getListaDetalles(7, 1);
						$combo->getComboDb("cmb_tipo_sangre", $tipo_sangre, $lista_tipos_sangre, "id_detalle,nombre_detalle", " ", "", 1, "width:100%;");
					?>
                </td>
                <td align="left">
                	<?php
						$lista_factor_rh = $dbListas->getListaDetalles(9, 1);
						$combo->getComboDb("cmb_factor_rh", $factor_rh, $lista_factor_rh, "id_detalle,nombre_detalle", " ", "", 1, "width:100%;");
					?>
                </td>
            </tr>
            <?php
				$lista_paises = $dbPaises->getPaises();
				$lista_departamentos = $dbDepartamentos->getDepartamentos();
				$lista_municipios = $dbDepMuni->getMunicipiosDepartamento($cod_dep);
				$lista_municipios_nac = $dbDepMuni->getMunicipiosDepartamento($cod_dep_nac);
            ?>
            <tr>
                <td align="left"><label>Pa&iacute;s de nacimiento*</label></td>
                <td align="left" id="td_dep_col_nac" style="display:<?php if ($id_pais_nac == "1") { ?>table-cell<?php } else { ?>none<?php } ?>;"><label>Departamento de nacimiento*</label></td>
                <td align="left" id="td_mun_col_nac" style="display:<?php if ($id_pais_nac == "1") { ?>table-cell<?php } else { ?>none<?php } ?>;"><label>Municipio de nacimiento*</label></td>
                <td align="left" id="td_dep_otro_nac" style="display:<?php if ($id_pais_nac != "1") { ?>table-cell<?php } else { ?>none<?php } ?>;"><label>Estado/regi&oacute;n de nacimiento*</label></td>
                <td align="left" id="td_mun_otro_nac" style="display:<?php if ($id_pais_nac != "1") { ?>table-cell<?php } else { ?>none<?php } ?>;"><label>Municipio de nacimiento*</label></td>
            </tr>
            <tr>
                <td align="left">
                	<?php
						$combo->getComboDb("cmb_pais_nac", $id_pais_nac, $lista_paises, "id_pais,nombre_pais", "", "seleccionar_pais(this.value, 'nac');", 1, "width:100%;");
					?>
                </td>
                <td align="left" id="td_dep_col_val_nac" style="display:<?php if ($id_pais_nac == "1") { ?>table-cell<?php } else { ?>none<?php } ?>;">
                	<?php
						$combo->getComboDb("cmb_cod_dep_nac", $cod_dep_nac, $lista_departamentos, "cod_dep,nom_dep", " ", "seleccionar_departamento(this.value, 'nac');", 1, "width:100%;");
					?>
                </td>
                <td align="left" id="td_mun_col_val_nac" style="display:<?php if ($id_pais_nac == "1") { ?>table-cell<?php } else { ?>none<?php } ?>;">
                	<div id="d_municipio_nac">
                    	<?php
							$combo->getComboDb("cmb_cod_mun_nac", $cod_mun_nac, $lista_municipios_nac, "cod_mun_dane,nom_mun", " ", "", 1, "width:100%;");
						?>
                    </div>
                </td>
                <td align="left" id="td_dep_otro_val_nac" style="display:<?php if ($id_pais_nac != "1") { ?>table-cell<?php } else { ?>none<?php } ?>;">
                	<input type="text" id="txt_nom_dep_nac" value="<?php echo($nom_dep_nac); ?>" maxlength="50" style="width:100%;" onblur="trim(this.value);" />
                </td>
                <td align="left" id="td_mun_otro_val_nac" style="display:<?php if ($id_pais_nac != "1") { ?>table-cell<?php } else { ?>none<?php } ?>;">
                	<input type="text" id="txt_nom_mun_nac" value="<?php echo($nom_mun_nac); ?>" maxlength="50" style="width:100%;" onblur="trim(this.value);" />
                </td>
            </tr>
            <tr>
                <td align="left"><label>Pa&iacute;s de residencia*</label></td>
                <td align="left" id="td_dep_col_res" style="display:<?php if ($id_pais == "1") { ?>table-cell<?php } else { ?>none<?php } ?>;"><label>Departamento de residencia*</label></td>
                <td align="left" id="td_mun_col_res" style="display:<?php if ($id_pais == "1") { ?>table-cell<?php } else { ?>none<?php } ?>;"><label>Municipio de residencia*</label></td>
                <td align="left" id="td_dep_otro_res" style="display:<?php if ($id_pais != "1") { ?>table-cell<?php } else { ?>none<?php } ?>;"><label>Estado/regi&oacute;n de residencia*</label></td>
                <td align="left" id="td_mun_otro_res" style="display:<?php if ($id_pais != "1") { ?>table-cell<?php } else { ?>none<?php } ?>;"><label>Municipio de residencia*</label></td>
                <td align="left"><label>Zona de residencia*</label></td>
            </tr>
            <tr>
                <td align="left">
                	<?php
						$combo->getComboDb("cmb_pais_res", $id_pais, $lista_paises, "id_pais,nombre_pais", "", "seleccionar_pais(this.value, 'res');", 1, "width:100%;");
					?>
                </td>
                <td align="left" id="td_dep_col_val_res" style="display:<?php if ($id_pais == "1") { ?>table-cell<?php } else { ?>none<?php } ?>;">
                	<?php
						$combo->getComboDb("cmb_cod_dep_res", $cod_dep, $lista_departamentos, "cod_dep,nom_dep", " ", "seleccionar_departamento(this.value, 'res');", 1, "width:100%;");
					?>
                </td>
                <td align="left" id="td_mun_col_val_res" style="display:<?php if ($id_pais == "1") { ?>table-cell<?php } else { ?>none<?php } ?>;">
                	<div id="d_municipio_res">
                    	<?php
							$combo->getComboDb("cmb_cod_mun_res", $cod_mun, $lista_municipios, "cod_mun_dane,nom_mun", " ", "", 1, "width:100%;");
						?>
                    </div>
                </td>
                <td align="left" id="td_dep_otro_val_res" style="display:<?php if ($id_pais != "1") { ?>table-cell<?php } else { ?>none<?php } ?>;">
                	<input type="text" id="txt_nom_dep_res" value="<?php echo($nom_dep); ?>" maxlength="50" style="width:100%;" onblur="trim(this.value);" />
                </td>
                <td align="left" id="td_mun_otro_val_res" style="display:<?php if ($id_pais != "1") { ?>table-cell<?php } else { ?>none<?php } ?>;">
                	<input type="text" id="txt_nom_mun_res" value="<?php echo($nom_mun); ?>" maxlength="50" style="width:100%;" onblur="trim(this.value);" />
                </td>
                <td align="left">
                	<?php
						$lista_zonas = $dbListas->getListaZona();
						$combo->getComboDb("cmb_zona", $id_zona, $lista_zonas, "id_detalle,nombre_detalle", " ", "", 1, "width:100%;");
					?>
                </td>
            </tr>
            <tr>
                <td align="left"><label>Direcci&oacute;n*</label></td>
                <td align="left"><label>e-mail</label></td>
                <td align="left"><label>Tel&eacute;fono 1*</label></td>
                <td align="left"><label>Tel&eacute;fono 2</label></td>
            </tr>
            <tr>
                <td align="left">
                	<input type="text" id="txt_direccion" value="<?php echo($direccion); ?>" maxlength="200" style="width:100%;" onblur="trim(this.value);" />
                </td>
                <td align="left">
                	<input type="text" id="txt_email" value="<?php echo($email); ?>" maxlength="50" style="width:100%;" onblur="trim(this.value);" />
                </td>
                <td align="left">
                	<input type="text" id="txt_telefono_1" value="<?php echo($telefono_1); ?>" maxlength="10" style="width:100%;" onkeypress="return solo_caracteres(event, '0123456789');" onblur="trim(this.value);" />
                </td>
                <td align="left">
                	<input type="text" id="txt_telefono_2" value="<?php echo($telefono_2); ?>" maxlength="10" style="width:100%;" onkeypress="return solo_caracteres(event, '0123456789');" onblur="trim(this.value);" />
                </td>
            </tr>
            <tr>
                <td align="left"><label>Profesi&oacute;n*</label></td>
                <td align="left"><label>Estado civil*</label></td>
                <td align="left"><label>Desplazado</label></td>
                <td align="left"><label>Etnia</label></td>
            </tr>
            <tr>
                <td align="left">
                	<input type="text" id="txt_profesion" value="<?php echo($profesion); ?>" maxlength="100" style="width:100%;" onblur="trim(this.value);" />
                </td>
                <td align="left">
                	<?php
						$lista_estados_civiles = $dbListas->getListaDetalles(40, 1);
						$combo->getComboDb("cmb_estado_civil", $id_estado_civil, $lista_estados_civiles, "id_detalle,nombre_detalle", " ", "", 1, "width:100%;");
					?>
                </td>
                <td align="left">
                	<?php
						$lista_desplazados = $dbListas->getListaDesplazado();
						$combo->getComboDb("cmb_desplazado", $ind_desplazado, $lista_desplazados, "id_detalle,nombre_detalle", " ", "", 1, "width:100%;");
					?>
                </td>
                <td align="left">
                	<?php
						$lista_etnias = $dbListas->getListaEtnia();
						$combo->getComboDb("cmb_etnia", $id_etnia, $lista_etnias, "id_detalle,nombre_detalle", " ", "", 1, "width:100%;");
					?>
                </td>
            </tr>
            <tr>
                <td align="left"><label>Observaciones</label></td>
            </tr>
            <tr>
                <td align="left" colspan="2">
                	<textarea id="txt_observ_paciente" style="width:100%; height:75px;" onblur="trim(this.value);"><?php echo($observ_paciente); ?></textarea>
                </td>
            </tr>
			<tr>
                <td align="left"colspan="2">
					<label>¿Autoriza el tratamiento de datos personales?</label>
				</td>
				<td align="left"colspan="3">
                	<?php $ind_habeas_data = $ind_habeas_data == "1" ? $ind_habeas_data : $ind_habeas_data="";  ?>
					<input type="checkbox" onchange="validar_check(1);" id="ind_habeas_1" name="ind_habeas_1" value="1" ><label><b>S&iacute;</b></label>
					<input type="checkbox" onchange="validar_check(0);" id="ind_habeas_0" name="ind_habeas_0" value="" ><label><b>No</b></label>
                    <input type="hidden" id="ind_habeas_db" name="ind_habeas_db" value="<?= $ind_habeas_data ?>" />
				</td>
            </tr>
        </table>
    </fieldset>
    <br />
    <div id="d_btn_guardar_paciente">
	    <input type="button" value="Guardar cambios" class="btnPrincipal" onclick="confirmar_guardar_paciente();" />
    </div>
    <div id="d_esperar_guardar_paciente" style="display:none;">
    	<img src="../imagenes/ajax-loader.gif" />
    </div>
    <?php
}

switch ($opcion) {
    case "1": //Cargar datos del paciente
        $texto_busqueda = $utilidades->str_decode($_POST["texto_busqueda"]);
		
        $tabla_personas = $dbHistoriaClinica->getPacientesHistoriaClinica($texto_busqueda);
        $cantidad_datos = count($tabla_personas);

        if ($cantidad_datos == 1) {//Si se encontro un solo registro
            $id_paciente = $tabla_personas[0]['id_paciente'];
			
            ver_datos_paciente($id_paciente);
        } else if ($cantidad_datos > 1) {
            ?>
            <table id="tabla_persona_hc" border="0" class="paginated modal_table" style="width:100%;">
                <thead>
                    <tr class="headegrid">
                        <th class="headegrid" align="center">Documento</th>	
                        <th class="headegrid" align="center">Pacientes</th>
                    </tr>
                </thead>
                <?php
					foreach ($tabla_personas as $fila_personas) {
						$id_paciente = $fila_personas['id_paciente'];
						$nombre_1 = $fila_personas['nombre_1'];
						$nombre_2 = $fila_personas['nombre_2'];
						$apellido_1 = $fila_personas['apellido_1'];
						$apellido_2 = $fila_personas['apellido_2'];
						$numero_documento = $fila_personas['numero_documento'];
						$nombres_apellidos = $funciones_persona->obtenerNombreCompleto($nombre_1, $nombre_2, $apellido_1, $apellido_2);
                ?>
                <tr class="celdagrid" onclick="ver_datos_paciente(<?php echo($id_paciente); ?>);">
                    <td align="left"><?php echo($numero_documento); ?></td>	
                    <td align="left"><?php echo($nombres_apellidos); ?></td>
                </tr>
                <?php
					}
				?>
            </table>
            <script id='ajax'>
                //<![CDATA[ 
                $(function() {
                    $('.paginated', 'tabla_persona_hc').each(function(i) {
                        $(this).text(i + 1);
                    });

                    $('table.paginated').each(function() {
                        var currentPage = 0;
                        var numPerPage = 5;
                        var $table = $(this);
                        $table.bind('repaginate', function() {
                            $table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
                        });
                        $table.trigger('repaginate');
                        var numRows = $table.find('tbody tr').length;
                        var numPages = Math.ceil(numRows / numPerPage);
                        var $pager = $('<div class="pager"></div>');
                        for (var page = 0; page < numPages; page++) {
                            $('<span class="page-number"></span>').text(page + 1).bind('click', {
                                newPage: page
                            }, function(event) {
                                currentPage = event.data['newPage'];
                                $table.trigger('repaginate');
                                $(this).addClass('active').siblings().removeClass('active');
                            }).appendTo($pager).addClass('clickable');
                        }
                        $pager.insertBefore($table).find('span.page-number:first').addClass('active');
                    });
                });
                //]]>
            </script>
            <?php
        } else if ($cantidad_datos == 0) {
            echo"<div class='msj-vacio'>
					<p>No se encontraron pacientes</p>
			     </div>";
        }
        break;
		
    case "2": //Mostrar los datos de un paciente
        @$id_paciente = $utilidades->str_decode($_POST["id_paciente"]);
        ver_datos_paciente($id_paciente);
     	break;
		
	case "3": //Guardar datos del paciente
		$id_usuario = $_SESSION["idUsuario"];
		@$id_paciente = $utilidades->str_decode($_POST["id_paciente"]);
		@$id_tipo_documento = $utilidades->str_decode($_POST["id_tipo_documento"]);
		@$numero_documento = $utilidades->str_decode($_POST["numero_documento"]);
		@$nombre_1 = $utilidades->str_decode($_POST["nombre_1"]);
		@$nombre_2 = $utilidades->str_decode($_POST["nombre_2"]);
		@$apellido_1 = $utilidades->str_decode($_POST["apellido_1"]);
		@$apellido_2 = $utilidades->str_decode($_POST["apellido_2"]);
		@$sexo = $utilidades->str_decode($_POST["sexo"]);
		@$fecha_nacimiento = $utilidades->str_decode($_POST["fecha_nacimiento"]);
		@$tipo_sangre = $utilidades->str_decode($_POST["tipo_sangre"]);
		@$factor_rh = $utilidades->str_decode($_POST["factor_rh"]);
		@$id_pais_nac = $utilidades->str_decode($_POST["id_pais_nac"]);
		@$cod_dep_nac = $utilidades->str_decode($_POST["cod_dep_nac"]);
		@$cod_mun_nac = $utilidades->str_decode($_POST["cod_mun_nac"]);
		@$nom_dep_nac = $utilidades->str_decode($_POST["nom_dep_nac"]);
		@$nom_mun_nac = $utilidades->str_decode($_POST["nom_mun_nac"]);
		@$id_pais = $utilidades->str_decode($_POST["id_pais"]);
		@$cod_dep = $utilidades->str_decode($_POST["cod_dep"]);
		@$cod_mun = $utilidades->str_decode($_POST["cod_mun"]);
		@$nom_dep = $utilidades->str_decode($_POST["nom_dep"]);
		@$nom_mun = $utilidades->str_decode($_POST["nom_mun"]);
		@$id_zona = $utilidades->str_decode($_POST["id_zona"]);
		@$direccion = $utilidades->str_decode($_POST["direccion"]);
		@$email = $utilidades->str_decode($_POST["email"]);
		@$telefono_1 = $utilidades->str_decode($_POST["telefono_1"]);
		@$telefono_2 = $utilidades->str_decode($_POST["telefono_2"]);
		@$profesion = $utilidades->str_decode($_POST["profesion"]);
		@$id_estado_civil = $utilidades->str_decode($_POST["id_estado_civil"]);
		@$ind_desplazado = $utilidades->str_decode($_POST["ind_desplazado"]);
		@$id_etnia = $utilidades->str_decode($_POST["id_etnia"]);
		@$observ_paciente = $utilidades->str_decode($_POST["observ_paciente"]);
		@$ind_habeas_data = $utilidades->str_decode($_POST["ind_habeas_data"]);
		
		$resultado = $dbPacientes->editar_paciente($id_paciente, $id_tipo_documento, $numero_documento, $nombre_1, $nombre_2, $apellido_1, $apellido_2, $sexo, $fecha_nacimiento,$tipo_sangre, $factor_rh, $id_pais_nac, $cod_dep_nac, $cod_mun_nac, $nom_dep_nac, $nom_mun_nac, $id_pais, $cod_dep, $cod_mun, $nom_dep, $nom_mun, $id_zona, $direccion, $email, $telefono_1, $telefono_2, $profesion, $id_estado_civil, $ind_desplazado, $id_etnia, $id_usuario, $observ_paciente, $ind_habeas_data);
	?>
    <input type="hidden" id="hdd_resultado_guardar_paciente" value="<?php echo($resultado); ?>" />
    <?php
		break;
		
	case "4": //Se carga el combo de municipios
		@$cod_dep = $utilidades->str_decode($_POST["cod_dep"]);
		@$sufijo = $utilidades->str_decode($_POST["sufijo"]);
		
		$lista_municipios = $dbDepMuni->getMunicipiosDepartamento($cod_dep);
		$combo->getComboDb("cmb_cod_mun_".$sufijo, "", $lista_municipios, "cod_mun_dane,nom_mun", " ", "", 1, "width:100%;");
		break;
}
?>
