<?php
	session_start();
	/*
	  Pagina listado de perfiles, muestra los perfiles existentes, para modificar o crear uno nuevo
	  Autor: Helio Ruber López - 16/09/2013
	 */
	
	require_once("../db/DbVariables.php");
	require_once("../db/DbListas.php");
	require_once("../funciones/Utilidades.php");
	require_once("../funciones/Class_Combo_Box.php");
	require_once("../principal/ContenidoHtml.php");
	
	$dbVariables = new Dbvariables();
	$dbListas = new DbListas();
	$utilidades = new Utilidades();
	$combo = new Combo_Box();
	$contenido = new ContenidoHtml();
	$tipo_acceso_menu = $contenido->obtener_permisos_menu($_POST["hdd_numero_menu"]);
	
	//variables
	$titulo = $dbVariables->getVariable(1);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title><?php echo $titulo['valor_variable']; ?></title>
        <link href="../css/estilos.css" rel="stylesheet" type="text/css" />
        <link href="../css/azul.css" rel="stylesheet" type="text/css" />
	    <link href="../css/jquery-ui.css" rel="stylesheet" type="text/css" />
    	<link href="../css/foundation-datepicker.css" rel="stylesheet" type="text/css" />
	    <link href="http://netdna.bootstrapcdn.com/font-awesome/3.0.2/css/font-awesome.css" rel="stylesheet">
        
		<script type='text/javascript' src='../js/jquery.min.js'></script>
        <script type="text/javascript" src="../js/jquery-ui.custom.js"></script>
        <script type="text/javascript" src="../js/jquery.cookie.js"></script>
        <script type='text/javascript' src='../js/jquery.validate.js'></script>
        <script type='text/javascript' src='../js/jquery.validate.add.js'></script>
        <script type='text/javascript' src='../js/ajax.js'></script>
        <script type='text/javascript' src='../js/funciones.js'></script>
        <script type='text/javascript' src='listas_espera.js'></script>
		
	    <script type='text/javascript' src='../js/validaFecha.js'></script>
    	<script type='text/javascript' src='../js/foundation-datepicker.js'></script>
	    <script type="text/javascript" src="../js/jquery.maskedinput.js"></script>
    	
        <link href="../src/skin-vista/ui.dynatree.css" rel="stylesheet" type="text/css" >
        <script src="../src/jquery.dynatree.js" type="text/javascript"></script>
    </head>
    <body>
        <?php
			$contenido->validar_seguridad(0);
			$contenido->cabecera_html();
        ?>
        <div class="title-bar">
            <div class="wrapper">
                <div class="breadcrumb">
                    <ul>
                        <li class="breadcrumb_on">Listas de espera para cirug&iacute;as</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="contenedor_principal volumen">
            <div class="padding">
                <table style="width: 100%;">
                    <tr valign="middle">
                        <td align="center" colspan="4">
                            <div id="advertenciasg">
                                <div class='contenedor_error' id='contenedor_error'></div>
                                <div class='contenedor_exito' id='contenedor_exito'></div>
                            </div> 
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="width:79%;">
                            <input type="text" id="txt_parametro" name="txt_parametro" placeholder="Nombre o n&uacute;mero de documento del paciente" onblur="trim_cadena(this);" />
                        </td>
                        <td rowspan="2" style="width:10%;">
                            <input type="submit" id="btnBuscar" nombre="btnBuscar" value="Buscar" class="btnPrincipal peq" onclick="buscar_lista_espera();"/>
                        </td>
                        <td rowspan="2" style="width:11%;">
                        	<?php
                            	if ($tipo_acceso_menu == "2") {
							?>
                            <input type="button" id="btn_buscar_usuario" nombre="btn_buscar_usuario" value="Nuevo registro" class="btnPrincipal peq" onclick="agregar_nueva_espera();"/>
                            <?php
								}
							?>
                        </td>
                    </tr>
                    <tr>
                    	<td align="right" style="width:10%;">
                           	<label class="inline">Tipo de cirug&iacute;a</label>
                        </td>
                       	<td align="left" style="width:69%;">
                           	<?php
                               	$lista_tipos_espera = $dbListas->getListaDetalles(42);
								
								$combo->getComboDb("cmb_tipo_lista", "", $lista_tipos_espera, "id_detalle, nombre_detalle", "--Seleccione un tipo de cirug&iacute;a--", "", true, "width:250px;");
							?>
                        </td>
                    </tr>
                </table>
                <div id="principal_espera"></div>
                <div id="d_guardar_lista" style="display:none;"></div>
            </div>
        </div>
        <script type='text/javascript' src='../js/foundation.min.js'></script>
        <script>
            $(document).foundation();
			
            $(function() {
                window.prettyPrint && prettyPrint();
            });
        </script>
        <?php
			$contenido->footer();
		?>  
    </body>
</html>
