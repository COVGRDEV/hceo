<?php
require_once("../db/DbVariables.php");
require_once("../db/DbUsuarios.php");
require_once("../db/DbMenus.php");
require_once("../db/DbHistoriaClinica.php");
require_once("../funciones/FuncionesPersona.php");

require_once("../db/Configuracion.php");

class ContenidoHtml {
    /*
     * Funcion para generar el enbabezadao de la pagina
     */

    public function cabecera_html() {
        $variables = new Dbvariables();
        $usuarios = new DbUsuarios();
        $menus = new DbMenus();
		
        //variables
        $titulo = $variables->getVariable(1);

        //usuarios
        $usuarios_r = $usuarios->getUsuario($_SESSION["nomUsuario"]);
        ?>
        <div class="topbar">
            <div class="wrapper">
                <a href="#" rel="home"><h1 class="ir logo">Historia Cl&iacute;nica</h1></a>
                <ul class="dropdown top-nav">
                    <?php
                    //Array que contendrá los accesos del usuario
                    $arr_accesos_usuario = array();

                    //Imprime el menu
                    $menus_r = $menus->getListaMenus2($_SESSION["idUsuario"]);

                    foreach ($menus_r as $value) {
                        if ($value['id_menu_padre'] == 0) {
                            ?>
                            <li>
                                <a href="#" onclick="enviar_credencial('<?php echo($value['pagina_menu']); ?>', <?php echo($value['id_menu']); ?>)"><?php echo($value['nombre_menu']); ?></a>
                                <ul>
                                    <?php
                                    for ($i = 0; $i <= count($menus_r) - 1; $i++) {
                                        if ($menus_r[$i]['id_menu_padre'] == $value['id_menu']) {
                                            ?>
                                            <li>
                                                <a href="#" onclick="enviar_credencial('<?php echo($menus_r[$i]['pagina_menu']); ?>', <?php echo($menus_r[$i]['id_menu']); ?>)"><?php echo($menus_r[$i]['nombre_menu']); ?></a>
                                                <ul>
                                                    <?php
                                                    for ($e = 0; $e <= count($menus_r) - 1; $e++) {
                                                        if ($menus_r[$e]['id_menu_padre'] == $menus_r[$i]['id_menu']) {
                                                            ?>
                                                            <li><a href="#" onclick="enviar_credencial('<?php echo($menus_r[$e]['pagina_menu']); ?>', <?php echo($menus_r[$e]['id_menu']); ?>)"><?php echo($menus_r[$e]['nombre_menu']); ?></a></li>
                                                            <?php
                                                        }
                                                    }
                                                    ?>
                                                </ul>
                                            </li>
                                            <?php
                                        }
                                    }
                                    ?>
                                </ul>
                            </li>
                            <?php
                        }

                        //Se el menú con el tipo de acceso al array
                        $arr_accesos_usuario[$value["id_menu"]] = intval($value["tipo_acceso"]);
                    }

                    //Se agregan los tipos de acceso a la sesión
                    $_SESSION["accesos_usuario"] = $arr_accesos_usuario;
                    ?>
                    <li><a href="#">Opciones</a>
                        <ul class="sub_menu">
                            <li><a href="#" onclick="enviar_credencial('../principal/pass.php', 0)">Cambiar contrase&ncaron;a</a></li>
                            <li><a href="#" onclick="confirmar()">Salir</a>
                        </ul>
                    </li>
                    

                    </li>
                </ul>
                <p style="margin: 0; color: #FFF; text-align: right;font-size: 9pt;">Usuario: <span style="font-weight: 600;"><?php echo $_SESSION["nomUsuario"]; ?></span></p>
            </div>
        </div>
        <?php
    }

    /*
     * Funcion para generar el pie de pagina 
     */
    public function footer() {
        ?>
        <div class="footer clearfix">
            <div class="wrapper">
                <p class="left" style="text-align: left;"><?php echo Configuracion::$FOOTER_LEFT;?></p>
                <p class="right"><?php echo Configuracion::$FOOTER_RIGHT." ".date("Y");?></p>
            </div>
        </div>
        <div id="fondo_negro_adic" class="d_fondo_negro" style="z-index:4;"></div>
        <div class="div_centro" id="d_centro_adic" style="display:none; z-index:5;">
            <a name="a_cierre_panel_adic" id="a_cierre_panel_adic" class="a_cierre_panel" href="#" onclick="cerrar_div_centro_adic();"></a>
            <div class="div_interno" id="d_interno_adic"></div>
        </div>
        <div id="fondo_negro_extend" class="d_fondo_negro"></div>
        <div class="div_centro" id="d_centro_extend" style="display:none; width:99%; height:98%; top:1%;">
            <a name="a_cierre_panel_extend" id="a_cierre_panel_extend" class="a_cierre_panel" href="#" onclick="cerrar_div_centro_extend();"></a>
            <div class="div_interno" id="d_interno_extend"></div>
        </div>
        <div id="fondo_negro" class="d_fondo_negro"></div>
        <div class="div_centro" id="d_centro" style="display:none;">
            <a name="a_cierre_panel" id="a_cierre_panel" class="a_cierre_panel" href="#" onclick="cerrar_div_centro();"></a>
            <div class="div_interno" id="d_interno"></div>
        </div>
        <div id="d_impresion_hc" style="display:none;"></div>
        <?php
    }
	
	/*
	 * Pie de pagina pra las paginas iframe
	 */
	public function footer_iframe() {
        ?>
        <div id="fondo_negro" class="d_fondo_negro"></div>
        <div class="div_centro" id="d_centro" style="display:none;">
            <a name="a_cierre_panel" id="a_cierre_panel" href="#" onclick="cerrar_div_centro();"></a>
            <div class="div_interno" id="d_interno"></div>
        </div>
        <div id="d_impresion_hc" style="display:none;"></div>
        <?php
    }
	
	/*
     * Funcion para generar DIV flotante ver HC
     */

    public function ver_historia($id_paciente) {
    	$historia_clinica = new DbHistoriaClinica();
		$personas = new FuncionesPersona();
		$variables = new Dbvariables();
		@$credencial = $_POST["credencial"];
		@$id_menu = $_POST["hdd_numero_menu"];
		?>
        <div id="caja_flotante" style="width:100px;">
	    	<div id="ver_hc_panel" onclick="ver_hc_panel();">
	    		<h6>Ver HC</h6>
	    		<div class="ver_hc"></div>
	    	</div>
	    	<div id="ocultar_hc_panel" style="display: none;" onclick="ocultar_hc_panel();">
	    		<h6>Ocultar Historia Cl&iacute;nica</h6>
	    		<div class="ocultar_hc"></div>
	    	</div>
	    	<div id='detalle_hc' style="display: none; overflow:auto; max-height:300px;">	
    		<?php
				$tabla_registro_hc_aux = $historia_clinica->getRegistrosHistoriaClinica($id_paciente);
    		?>
			<table class="modal_table" style="width:98%;" >
                <thead>
                    <tr>
                        <th class="th_reducido" align="center" style="width:1%;"></th>
                        <th class="th_reducido" align="center" style="width:15%;">Fecha</th>
                        <th class="th_reducido" align="center" style="width:83%;">Tipo de registro</th>
                        <th class="th_reducido" align="center" style="width:1%;"></th>
                    </tr>
                </thead>
                <?php
					if (count($tabla_registro_hc_aux) > 0) {
						$tabla_registro_hc = array();
						for ($i = count($tabla_registro_hc_aux) - 1; $i >= 0; $i--) {
							$reg_aux = $tabla_registro_hc_aux[$i];
							array_push($tabla_registro_hc, $reg_aux);
						}
						
						//Se reordena la hostoria clínica de forma descendente
						foreach ($tabla_registro_hc as $fila_registro_hc) {
							$id_paciente = $fila_registro_hc['id_paciente'];
							$nombre_1 = $fila_registro_hc['nombre_1'];
							$nombre_2 = $fila_registro_hc['nombre_2'];
							$apellido_1 = $fila_registro_hc['apellido_1'];
							$apellido_2 = $fila_registro_hc['apellido_2'];
							$nombre_persona = $personas->obtenerNombreCompleto($nombre_1, $nombre_2, $apellido_1, $apellido_2);
							$id_admision = $fila_registro_hc['id_admision'];
							$pagina_consulta = $fila_registro_hc['pagina_menu'];
							
							$id_hc = $fila_registro_hc['id_hc'];
							$id_tipo_reg = $fila_registro_hc['id_tipo_reg'];
							$nombre_tipo_reg = $fila_registro_hc['nombre_tipo_reg'];
							$fecha_hc = $fila_registro_hc['fecha_hora_hc_t'];
							$estado_hc = $fila_registro_hc['ind_estado'];
							
							if ($estado_hc == 1) {
								$img_estado="<img src='../imagenes/icon-convencion-no-disponible.png' />";
							} else if($estado_hc == 2) {
								$img_estado="<img src='../imagenes/icon-convencion-disponible.png' />";
							}
							
				?>
                <tr>
                    <td class="td_reducido" align="center"><img src="../imagenes/imprimir_hc.png" title="Imprimir" onclick="imprimir_reg_hc(<?php echo($id_hc); ?>);" /></td>
                    <td class="td_reducido" align="left" onclick="mostrar_consultas_div(<?php echo($id_paciente); ?>, '<?php echo($nombre_persona); ?>', <?php echo(intval($id_admision, 10)); ?>, '<?php echo($pagina_consulta); ?>', <?php echo($id_hc); ?>, <?php echo($credencial); ?>, <?php echo($id_menu); ?>);"><?php echo($fecha_hc); ?></td>
                    <td class="td_reducido" align="left" onclick="mostrar_consultas_div(<?php echo($id_paciente); ?>, '<?php echo($nombre_persona); ?>', <?php echo(intval($id_admision, 10)); ?>, '<?php echo($pagina_consulta); ?>', <?php echo($id_hc); ?>, <?php echo($credencial); ?>, <?php echo($id_menu); ?>);"><?php echo($nombre_tipo_reg); ?></td>
                    <td class="td_reducido" align="center"><?php echo($img_estado); ?></td>
                </tr>
                <?php
						}
					} else {
						//Si no se encontraron registros de historia clinica
				?>
                <tr>
                    <td colspan="4">
                        <div class="msj-vacio">
                            <p>No hay HC para este paciente</p>
                        </div>
                    </td>
                </tr>
                <?php
					}
				?>
            </table>
           	</div>
 		</div> 
        <?php
    }

    /**
     * Funcion para validar si existe un a session o si la sesion expiro
     * $ajax= 1 : SI entro por ajax
     * $ajax= 0 : NO entro por ajax
     */
    public function validar_seguridad($ajax) {
        $id_usuario = $_SESSION["idUsuario"];
        @$credencial = $_POST["credencial"];
        @$id_menu = $_POST["hdd_numero_menu"];

        if (isset($_SESSION["idUsuario"])) {
            if ($credencial == '' && $ajax == 0) {
                $credencial = $id_usuario;
                //Se crear la variable para continuar con la credencial activa
                ?>
                <form name="frm_credencial" id="frm_credencial" method="post" action="../principal/principal.php">
                    <input type="hidden" name="credencial" id="credencial" value="<?php echo($credencial); ?>" />
                    <input type="hidden" name="hdd_numero_menu" id="hdd_numero_menu" value="<?php echo($id_menu); ?>" />
                </form>
                <script type="text/javascript">
                                    document.frm_credencial.submit();
                </script>
                <?php
            } else if ($credencial == '' && $ajax == 1) {
                header("Location: ../principal/sesion_finalizada.html");
            } else if (($credencial == '' && $id_usuario == '') || ($credencial != $id_usuario)) {
                header("Location: ../principal/sesion_finalizada.html");
            } else if (($credencial == $id_usuario) && ($ajax == 0)) {
                ?>
                <form name="frm_credencial" id="frm_credencial" method="post" action="">
                    <input type="hidden" name="credencial" id="credencial" value="<?php echo($credencial); ?>" />
                    <input type="hidden" name="hdd_numero_menu" id="hdd_numero_menu" value="<?php echo($id_menu); ?>" />
                </form>
                <?php
            }
        } else {
            header("Location: ../principal/sesion_finalizada.html");
        }
    }

    function obtener_permisos_menu($id_menu) {
        $arr_accesos_usuario = $_SESSION["accesos_usuario"];
        $tipo_acceso = 0;
        if (isset($arr_accesos_usuario[$id_menu])) {
            $tipo_acceso = $arr_accesos_usuario[$id_menu];
        }

        return $tipo_acceso;
    }
	
	 

}
?>
