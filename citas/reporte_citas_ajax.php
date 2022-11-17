<?php
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

header('Content-Type: text/xml; charset=UTF-8');
session_start();
require_once("../db/DbCitas.php");
require_once '../db/DbListas.php';
require_once("../funciones/FuncionesPersona.php");
require_once '../funciones/Utilidades.php';
require_once('../db/DbVariables.php');

$dbCitas = new DbCitas();
$dbListas = new DbListas();
$funciones_persona = new FuncionesPersona();
$utilidades = new Utilidades();
$dbVariables =  new DbVariables();
$opcion = $_POST["opcion"];

function operacion_horas($hora, $minutos, $tipo, $cantidad, $formato) {
    if ($tipo == 1) { //Sumar minutos
        $horaInicial = $hora . ":" . $minutos;
        $segundos_horaInicial = strtotime($horaInicial);
        $segundos_minutoAnadir = $cantidad * 60;
        $nuevaHora = date("H:i", $segundos_horaInicial + $segundos_minutoAnadir);
    } else if ($tipo == 2) { //Restar minutos
        $horaInicial = $hora . ":" . $minutos;
        $segundos_horaInicial = strtotime($horaInicial);
        $segundos_minutoAnadir = $cantidad * 60;
        $nuevaHora = date("H:i", $segundos_horaInicial - $segundos_minutoAnadir);
    }

    if ($formato == 12) {
        $hora_nueva = explode(":", $nuevaHora);
        $hora_resultado = mostrar_hora_format($hora_nueva[0], $hora_nueva[1]);
    } else {
        $hora_resultado = $nuevaHora;
    }

    return $hora_resultado;
}

//Devulve la hora en formato 12 horas con la jornada
function mostrar_hora_format($hora, $minutos) {
    $hora = cifras_numero($hora, 2);
    $minutos = cifras_numero($minutos, 2);

    $hora_res = '';
    if ($hora > 12) {
        $hora = $hora - 12;
        $hora_res = $hora . ":" . $minutos . " PM";
    } else {
        $hora_res = $hora . ":" . $minutos . " AM";
    }

    return $hora_res;
}

function cifras_numero($consecutivo, $cifras) {
    $longitud = strlen($consecutivo);
    while ($longitud <= $cifras - 1) {
        $consecutivo = "0" . $consecutivo;
        $longitud = strlen($consecutivo);
    }
    return $consecutivo;
}

switch ($opcion) {
    case "1": //Carga el listado total de convenios / El resultado de buscar convenios
        $profesional = $utilidades->str_decode($_POST['profesional']);
        $lugar = $utilidades->str_decode($_POST['lugar']);
        //$estado = $utilidades->str_decode($_POST['estado']);
        $fechaInicial = $utilidades->str_decode($_POST['fechaInicial']);
        $fechaFinal = $utilidades->str_decode($_POST['fechaFinal']);
        $cita = $utilidades->str_decode($_POST['cita']);
        $tipoCita = $utilidades->str_decode($_POST['tipoCita']);
        $hora = $utilidades->str_decode($_POST['hora']);
        $convenio = $utilidades->str_decode($_POST['convenio']);

        //Enviar el array a la funcion buscar
        $contadorTp = $utilidades->str_decode($_POST['contadorTp']);
        $tiposCitas = array();
        for ($a = 1; $a <= $contadorTp; $a++) {
            $tiposCitas[$a] = $_POST['tp' . $a];
			
        }
		$arr_diferencia = $dbVariables->getDiferenciaFechas($fechaInicial, $fechaFinal, 2);
		$diferencia_dias = intval($arr_diferencia["dias"], 10);
		
		if ($diferencia_dias >= 34) {
			?>
			<input type="hidden" id="hdd_error_dias_b" name="hdd_error_dias_b" value="1" />
			<?php
		}else{
        $rta_aux = $dbCitas->getReporteCitas($profesional, $lugar, $fechaInicial, $fechaFinal, $cita, 0, $tipoCita, $hora, $tiposCitas, $convenio);
        $arr_cantidad_total_aux = $dbCitas->getReporteCitas($profesional, $lugar, $fechaInicial, $fechaFinal, $cita, 0, $tipoCita, $hora, $tiposCitas, $convenio, 1);
		$cantidad_total_aux = intval($arr_cantidad_total_aux[0]["cantidad"], 10);
        ?>
        <table class="paginated modal_table" style="width: 99%; margin: auto;">
            <thead>
            	<tr>
            		<td colspan="7" align="left">
                    	<?php
                        	if (count($rta_aux) >= $cantidad_total_aux) {
						?>
                    	Se encontraron <b><?php echo(count($rta_aux))?></b> registros
                        <?php
							} else {
						?>
                    	Se muestran los primeros <b><?php echo(count($rta_aux))?></b> registros de <?php echo($cantidad_total_aux); ?> encontrados
                        <?php
							}
						?>
                    </td>
            	<tr>
                <tr>
                    <th style="">Fecha</th>
                    <th style="">Hora</th>
                    <th style="">Profesional</th>
                    <th style="">Paciente</th>
                    <th style="">Lugar cita</th>
                    <th style="">Tipo de cita</th>
                    <th style="">Estado</th>
                </tr>
            </thead>
            <?php
            if (count($rta_aux) >= 1) {
                foreach ($rta_aux as $value) {
                    ?>
                    <tr onclick="detalleCita(<?php echo $value['id_cita']; ?>)" title="<?php
                    //Imprime la Observacion de la cita en el tooltip
                    if ($value['id_estado_cita'] == 14 || $value['id_estado_cita'] == 16 || $value['id_estado_cita'] == 17 || $value['id_estado_cita'] == 82) {//Muestra la Observación
                        echo $value['observacion_cita'];
                    }
                    if ($value['id_estado_cita'] == 15 || $value['id_estado_cita'] == 18) {//Muestra la Observación
                        echo $value['observacion_cancela'];
                    }
					$lugar_cita = $dbListas->getDetalle($value['id_lugar_cita']);
					
                    ?>">
                        <td><?php
                            $fecha_cita_aux = substr($value['fecha_cita'], 0, 10);
                            $fecha_cita_aux = strtotime($fecha_cita_aux);
                            echo $funciones_persona->obtenerFecha4($fecha_cita_aux);
                            ?></td>
                        <td style=""><?php
                            $hora = substr($value['hora_aux'], 0, 2);
                            $minutos = substr($value['hora_aux'], 3, 4);
                            $hora_cita = operacion_horas(intval($hora), intval($minutos), 1, 0, 12);
                            echo $hora_cita;
                            ?></td>
                        <td><?php echo $value['profesional_aux']; ?></td>
                        <td><?php echo $value['nombre_1'] . ' ' . $value['nombre_2'] . ' ' . $value['apellido_1'] . ' ' . $value['apellido_2']; ?></td>
                        <td><?php echo $lugar_cita['nombre_detalle']; ?></td>
                        <td><?php echo $value['nombre_tipo_cita']; ?></td>
                        <td><?php echo $value['nombre_detalle']; ?></td>
                    </tr>
                    <?php
                }
            } else {
                ?>
                <td colspan="7">No hay resultados</td>
                <?php
            }
            ?>
        </table>
        <br/>
        <br/>
        <br/>
        <input type="button" onclick="generarPDF()" value="Reporte en PDF" class="btnPrincipal" />
        &nbsp;&nbsp;&nbsp;
        <input type="button" class="btnPrincipal" value="Reporte en Excel" onclick="exportar_a_excel();" />
        &nbsp;&nbsp;&nbsp;
        <input type="button" class="btnPrincipal" value="Archivo plano" onclick="generar_plano();" />
        <div id="d_generar_pdf" style="display:none;"></div>
        <div id="d_generar_plano" style="display:none;"></div>
        <form name="frm_excel" id="frm_excel" action="reporte_citas_excel.php" method="post" style="display:none;" target="_blank">
            <input type="hidden" id="hddProfesional" name="hddProfesional" />
            <input type="hidden" id="hddLugar" name="hddLugar" />
            <input type="hidden" id="hddFechaInicial" name="hddFechaInicial" />
            <input type="hidden" id="hddFechaFinal" name="hddFechaFinal" />
            <input type="hidden" id="hddCita" name="hddCita" />
            <input type="hidden" id="hddTipoCita" name="hddTipoCita" />
            <input type="hidden" id="hddHora" name="hddHora" />
            <input type="hidden" id="contadorTp" name="contadorTp" />
            <input type="hidden" id="convenio" name="convenio" />
        </form>

        <script id='ajax'>
            //<![CDATA[ 
            $(function() {
                $('.paginated', 'table').each(function(i) {
                    $(this).text(i + 1);
                });

                $('table.paginated').each(function() {
                    var currentPage = 0;
                    var numPerPage = 20;
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
		}
        break;

    case "2": //Informacion del detalle de la cita
        $idCita = $_POST['idCita'];

        $rta_aux = $dbCitas->getCita($idCita);

        if (count($rta_aux) >= 1) {
            ?>
            <div class="encabezado">
                <h3>C&oacute;digo de cita: <?php echo $rta_aux['id_cita']; ?></h3>
            </div>
            <div>
                <table style="width: 100%;">
                    <tr>
                        <td colspan="2" style="text-align: left;">
                            <h5>Doctor(a): <?php echo $rta_aux['profesional_atiende']; ?></h5>
                        </td>
                        <td colspan="2" style="text-align: right;">
                            <h5><?php
                                $fecha_cita_aux = substr($rta_aux['fecha_cita'], 0, 10);
                                $fecha_cita_aux = strtotime($fecha_cita_aux);
                                echo $funciones_persona->obtenerFecha4($fecha_cita_aux);
                                ?></h5>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">
                            <label class="inline"><b>Creado por: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['usuario_creador']; ?></label>
                        </td>
                        <td style="text-align: right;">
                            <label class="inline"><b>Fecha creaci&oacute;n: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['fecha_creacion_aux']; ?></label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">
                            <label class="inline"><b>Tipo de cita: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['nombre_tipo_cita']; ?></label>
                        </td>
                        <td style="text-align: right;">
                            <label class="inline"><b>Hora: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php
                                $hora = substr($rta_aux['hora_consulta'], 0, 2);
                                $minutos = substr($rta_aux['hora_consulta'], 3, 4);
                                $hora_cita = operacion_horas(intval($hora), intval($minutos), 1, 0, 12);
                                echo $hora_cita;
                                ?></label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">
                            <label class="inline"><b>Tipo de documento: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['nombre_detalle']; ?></label>
                        </td>
                        <td style="text-align: right;">
                            <label class="inline"><b>N&uacute;mero de documento: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['numero_documento']; ?></label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">
                            <label class="inline"><b>Primer nombre: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['nombre_1']; ?></label>
                        </td>
                        <td style="text-align: right;">
                            <label class="inline"><b>Segundo nombre: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['nombre_2']; ?></label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">
                            <label class="inline"><b>Primer apellido: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['apellido_1']; ?></label>
                        </td>
                        <td style="text-align: right;">
                            <label class="inline"><b>Segundo apellido: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['apellido_2']; ?></label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">
                            <label class="inline"><b>Tel&eacute;fono de contacto: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['telefono_contacto']; ?></label>
                        </td>
                        <td style="text-align: right;">
                            <label class="inline"><b>Convenio/Entidad: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['nombre_convenio_aux']; ?></label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">
                            <label class="inline"><b>Usa lentes: </b></label>
                        </td>
                        <td style="text-align: left;">
                            <label class="inline"><?php
                                if ($rta_aux['ind_lentes'] == '1') {
                                    echo 'Si';
                                } else {
                                    echo 'No';
                                };
                                ?></label>
                        </td>
                        <td style="text-align: right;" colspan="2">
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right;">
                            <label class="inline"><b>Observaci&oacute;n de la cita: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['observacion_cita']; ?></label>
                        </td>
                        <td style="text-align: right;">
                            <label class="inline"><b>Observaci&oacute;n de cita cancelada: </b></label>
                        </td>
                        <td>
                            <label class="inline"><?php echo $rta_aux['observacion_cancela']; ?></label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <input type="button" class="btnPrincipal" value="Reporte en PDF" onclick="generarPDFCita();" />
                            <input type="hidden" id="hdd_idCita" name="hdd_idCita"  value="<?php echo $rta_aux['id_cita']; ?>" />
                        </td>
                    </tr>
                </table>
                <div id="d_generar_pdf2" style="display: none;">
                </div>
                <?php
            } else {
                ?>
                <h3>No hay resultados</h3>
                <?php
            }
            break;
			
        case "3": //Reporte en formato PDF
            require_once("../funciones/pdf/fpdf.php");
            require_once("../funciones/pdf/makefont/makefont.php");
            require_once("../funciones/pdf/funciones.php");
			require_once('../db/DbVariables.php');
			
			$dbVariables =  new Dbvariables();
            $profesional = $_POST['profesional'];
            $lugar = $_POST['lugar'];
            $fechaInicial = $_POST['fechaInicial'];
            $fechaFinal = $_POST['fechaFinal'];
            $cita = $_POST['cita'];
            $tipoCita = $_POST['tipoCita'];
            $hora = $utilidades->str_decode($_POST['hora']);

            $convenio = $utilidades->str_decode($_POST['convenio']);

            //Enviar el array a la funcion buscar
            $contadorTp = $utilidades->str_decode($_POST['contadorTp']);
            $tiposCitas = array();
            for ($a = 1; $a <= $contadorTp; $a++) {
                $tiposCitas[$a] = $_POST['tp' . $a];
							
            }
			$arr_diferencia = $dbVariables->getDiferenciaFechas($fechaInicial, $fechaFinal, 2);
			$diferencia_dias = intval($arr_diferencia["dias"], 10);
            
            $rta_aux = $dbCitas->getReporteCitas($profesional, $lugar, $fechaInicial, $fechaFinal, $cita, 1, $tipoCita, $hora, $tiposCitas, $convenio);
			
			if($diferencia_dias>=34){
			//mostar mensaje de error
				?>
				 <input type="hidden" id="hdd_error_dias" name="hdd_error_dias" value="1" />
				<?php
			}
			else{
            //Genera el PDF
            $pdf = new FPDF('L', 'mm', 'Letter');
            $pdf->header = 1;
            $pdf->pie_pagina = true;
            $pdf->bordeMulticell = 1; //Si la tabla tiene borde. 1 = Con borde. 2 = Sin borde
            $pdf->resultados = count($rta_aux);
            $pdf->fecha1 = $fechaInicial == '' ? '' : ajustarCaracteres(html_entity_decode($funciones_persona->obtenerFecha5(strtotime($fechaInicial))));
            $pdf->fecha2 = $fechaFinal == '' ? '' : ajustarCaracteres(html_entity_decode($funciones_persona->obtenerFecha5(strtotime($fechaFinal))));

            $pdf->AddPage();

            $contador = 1;
            foreach ($rta_aux as $value) {
                $pdf->SetFont('Arial', '', 9);
                //$fecha_cita_aux = substr($value['fecha_cita'], 0, 10);
                //$fecha_cita_aux = strtotime($fecha_cita_aux);
                $fecha_cita_aux = $value['fecha_cita_t'];
				
                $hora = substr($value['hora_aux'], 0, 2);
                $minutos = substr($value['hora_aux'], 3, 4);
                $hora_cita = operacion_horas(intval($hora), intval($minutos), 1, 0, 12);
				
                $paciente_aux = '';
                if (strlen($value['nombre_1'] . ' ' . $value['nombre_2'] . ' ' . $value['apellido_1']) >= 25) {
                    $paciente_aux = substr($value['nombre_1'] . ' ' . $value['nombre_2'] . ' ' . $value['apellido_1'], 0, 25) . '...';
                } else {
                    $paciente_aux = $value['nombre_1'] . ' ' . $value['nombre_2'] . ' ' . $value['apellido_1'];
                }
				
                $convenio_aux = '';
                if (strlen($value['nombre_convenio_aux']) >= 17) {
                    $convenio_aux = substr($value['nombre_convenio_aux'], 0, 17) . '...';
                } else {
                    $convenio_aux = $value['nombre_convenio_aux'];
                }
				
                $observacion_aux = '';
                if (strlen($value['observacion_cita']) >= 29) {
                    $observacion_aux = substr($value['observacion_cita'], 0, 29) . '...';
                } else {
                    $observacion_aux = $value['observacion_cita'];
                }
				
                $pdf->SetAligns2(array('L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'));
				$pdf->SetWidths2(array(8, 20, 16, 26, 55, 45, 10, 80));
                
                $pdf->Row2(array($contador, $fecha_cita_aux, $hora_cita, $value['numero_documento'], ajustarCaracteres($paciente_aux), ajustarCaracteres($convenio_aux), ajustarCaracteres(substr($value['nombre_usuario'], 0, 1) . substr($value['apellido_usuario'], 0, 1)), ajustarCaracteres(html_entity_decode($value['observacion_cita']))));
				
                $contador++;
            }
			
            $pdf->Output();
            //Se guarda el documento pdf
            $nombreArchivo = "../tmp/encuestas_seguimiento_" . $_SESSION["idUsuario"] . ".pdf";
            $pdf->Output($nombreArchivo, "F");
        ?>
        <input type="hidden" name="hdd_archivo_pdf" id="hdd_archivo_pdf" value="<?php echo($nombreArchivo); ?>" />
        <?php
			}
			break;
			
        case "4": //Reporte en de la cita 
            require_once("../funciones/pdf/fpdf.php");
            require_once("../funciones/pdf/makefont/makefont.php");
            require_once("../funciones/pdf/funciones.php");
			
            $idCita = $_POST['idCita'];
            $rta_aux = $dbCitas->getCita($idCita);
            $hora_aux = explode(":", $rta_aux['hora_consulta']);
            $fecha_cita_aux = substr($rta_aux['fecha_cita'], 0, 10);
            $fecha_cita_aux = strtotime($fecha_cita_aux);
            
            //Genera el PDF
            $pdf = new FPDF('P', 'mm', 'Letter', NULL, NULL, NULL, NULL, NULL, '16');
            $pdf->header = 3;
            $pdf->pie_pagina = TRUE;
            $pdf->bordeMulticell = 1; //Si la tabla tiene borde. 1 = Con borde. 2 = Sin borde
            $pdf->pie_pagina = FALSE;
            $pdf->AddPage();
			
            $pdf->SetAligns2(array('R', 'L'/*,'R', 'L'*/));
            $pdf->SetWidths2(array(33, 163/*,35,63*/));
            $pdf->Row2(array('Profesional :', ajustarCaracteres(html_entity_decode($rta_aux['profesional_atiende']))));
			
			 $pdf->SetAligns2(array('R', 'L'/*,'R', 'L'*/));
            $pdf->SetWidths2(array(33, 163/*,35,63*/));
            $pdf->Row2(array('Lugar cita :', ajustarCaracteres(html_entity_decode(utf8_decode($rta_aux['lugar_cita'])))));
			
            $pdf->SetAligns2(array('R', 'L', 'R', 'L'));
            $pdf->SetWidths2(array(33, 65, 35, 63));
            $pdf->Row2(array('Tipo de cita :', ajustarCaracteres(html_entity_decode($rta_aux['nombre_tipo_cita'])), 'Fecha :', ajustarCaracteres(html_entity_decode($funciones_persona->obtenerFecha4($fecha_cita_aux, 0))) . ' - ' . mostrar_hora_format($hora_aux[0], $hora_aux[1])));
			
            $pdf->SetAligns2(array('R', 'L', 'R', 'L'));
            $pdf->SetWidths2(array(33, 65, 35, 63));
            $pdf->Row2(array('Tipo de documento :', ajustarCaracteres(html_entity_decode($rta_aux['nombre_detalle'])), ajustarCaracteres(html_entity_decode('Número de documento :')), $rta_aux['numero_documento']));
						
            $pdf->SetAligns2(array('R', 'L', 'R', 'L'));
            $pdf->SetWidths2(array(33, 65, 35, 63));
            $pdf->Row2(array('Primer nombre :', ajustarCaracteres(html_entity_decode($rta_aux['nombre_1'])), ajustarCaracteres(html_entity_decode('Segundo nombre :')), $rta_aux['nombre_2'] == '' ? '**********' : $rta_aux['nombre_2']));
			
            $pdf->SetAligns2(array('R', 'L', 'R', 'L'));
            $pdf->SetWidths2(array(33, 65, 35, 63));
            $pdf->Row2(array('Primer apellido :', ajustarCaracteres(html_entity_decode($rta_aux['apellido_1'])), ajustarCaracteres(html_entity_decode('Segundo apellido :')), $rta_aux['apellido_2'] == '' ? '**********' : $rta_aux['apellido_2']));
			
            $pdf->SetAligns2(array('R', 'L', 'R', 'L'));
            $pdf->SetWidths2(array(33, 163));
            $pdf->Row2(array('Convenio/Entidad :', ajustarCaracteres(html_entity_decode($rta_aux['nombre_convenio_aux']))));
			
            $pdf->Output();
            //Se guarda el documento pdf
            $nombreArchivo = "../tmp/reporte_citas_" . $_SESSION["idUsuario"] . ".pdf";
            $pdf->Output($nombreArchivo, "F");
        ?>
        <input type="hidden" name="hdd_archivo_pdf2" id="hdd_archivo_pdf2" value="<?php echo($nombreArchivo); ?>" />
        <?php
            break;
			
		case "5": //Archivo plano
			$id_usuario = $_SESSION["idUsuario"];
			
            $profesional = $_POST['profesional'];
            $lugar = $_POST['lugar'];
            $fechaInicial = $_POST['fechaInicial'];
            $fechaFinal = $_POST['fechaFinal'];
            $cita = $_POST['cita'];
            $tipoCita = $_POST['tipoCita'];
            $hora = $utilidades->str_decode($_POST['hora']);
			$convenio = $utilidades->str_decode($_POST['convenio']);
			$contadorTp = $utilidades->str_decode($_POST['contadorTp']);
			
            $tiposCitas = array();
            for ($a = 1; $a <= $contadorTp; $a++) {
                $tiposCitas[$a] = $_POST['tp'.$a];
            }
            
            $lista_citas = $dbCitas->getReporteCitas($profesional, $lugar, $fechaInicial, $fechaFinal, $cita, 1, $tipoCita, $hora, $tiposCitas, $convenio);
			
			//Se crea el archivo de texto
			$nombre_archivo = "../tmp/plano_citas_".$id_usuario;
			$arch_aux = fopen($nombre_archivo.".txt", "w+");
			
			foreach ($lista_citas as $cita_aux) {
				$linea_aux = $funciones_persona->obtenerNombreCompleto($cita_aux["nombre_1"], $cita_aux["nombre_2"], $cita_aux["apellido_1"], $cita_aux["apellido_2"]).",57,";
				
				//Se obtiene el número telefónico
				$finalizado_aux = false;
				$telefono_aux = "";
				$telefono_contacto_aux = trim($cita_aux["telefono_contacto"]);
				for ($i = 0; $i < strlen($telefono_contacto_aux) && !$finalizado_aux; $i++) {
					$num_aux = ord(substr($telefono_contacto_aux, $i, 1));
					if ($num_aux >= 48 && $num_aux <= 57) {
						$telefono_aux .= substr($telefono_contacto_aux, $i, 1);
					} else {
						break;
					}
				}
				
				if (strlen($telefono_aux) == 7 || strlen($telefono_aux) == 10) {
					if (strlen($telefono_aux) == 7) {
						$linea_aux .= "7".$telefono_aux.",";
					} else {
						$linea_aux .= $telefono_aux.",";
					}
					
					$arr_fecha = explode("/", $cita_aux["fecha_cita_t"]);
					$linea_aux .= $cita_aux["lugar_cita"].",".$funciones_persona->obtenerFecha3($arr_fecha[0], $arr_fecha[1], $arr_fecha[2]).",".$cita_aux["hora_cita_t"].",".$cita_aux["profesional_aux"];
					
					fwrite($arch_aux, $linea_aux."\r\n");
				}
			}
			fclose($arch_aux);
			
			//Se agrega el archivo de texto a un zip
			//function crear_zip($arr_archivos, $destino, $sobreescribir) {
			//Se crea el archivo
			$zip = new ZipArchive();
			if ($zip->open($nombre_archivo.".zip", ZIPARCHIVE::OVERWRITE) !== true) {
				return false;
			}
			
			//Se agrega el archivo
			$zip->addFile($nombre_archivo.".txt", "plano_citas.txt");
			
			$zip->close();
			
			//Se borra el archivo de texto
			@unlink($nombre_archivo.".txt");
		?>
        <input type="hidden" id="hdd_nombre_plano_zip" value="<?php echo($nombre_archivo.".zip"); ?>" />
        <?php
			break;
    }
    ?>
