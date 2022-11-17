<?php
	require_once("DbHistoriaClinica.php");
	
	class DbConsultaControlOptometria extends DbHistoriaClinica {
		/**
		 * Obtener los datos de a consulta de optometria a partir del ID de la HC
		 */
		public function getConsultaControlOptometria($id_hc) {
	        try {
	            $sql = "SELECT CO.*, DATE_FORMAT(HC.fecha_hora_hc, '%d/%m/%Y') AS fecha_hc_t, OJ.nombre_detalle AS ojo
	            		FROM consultas_control_optometria CO
	            		INNER JOIN historia_clinica HC ON CO.id_hc=HC.id_hc
						LEFT JOIN listas_detalle OJ ON CO.id_ojo=OJ.id_detalle
	            		WHERE CO.id_hc=".$id_hc;
				
	            return $this->getUnDato($sql);
	        } catch (Exception $e) {
	            return array();
	        }
	    }
		
		/**
		 * Obtener los datos de a consulta de optometria a partir del ID de la admisión asociada
		 */
		public function getConsultaControlOptometriaAdmision($id_admision) {
	        try {
	            $sql = "SELECT CO.*, DATE_FORMAT(HC.fecha_hora_hc, '%d/%m/%Y') AS fecha_hc_t, OJ.nombre_detalle AS ojo
						FROM consultas_control_optometria CO
						INNER JOIN historia_clinica HC ON CO.id_hc=HC.id_hc
						LEFT JOIN listas_detalle OJ ON CO.id_ojo=OJ.id_detalle
						WHERE HC.id_admision=".$id_admision;
				
	            return $this->getUnDato($sql);
	        } catch (Exception $e) {
	            return array();
	        }
	    }
		
		//Crear consulta de optometria
		public function crearConsultaControlOptometria($id_paciente, $id_admision, $id_tipo_reg, $id_usuario) {
	        try {
	            $sql = "CALL pa_crear_consultas_control_optometria(".$id_paciente.", ".$id_admision.", ".$id_tipo_reg.", ".$id_usuario.", @id)";
				
				$arrCampos[0] = "@id";
				$arrResultado = $this->ejecutarSentencia($sql, $arrCampos);
				$id_historia_clinica = $arrResultado["@id"];
				
				return $id_historia_clinica;
	        } catch (Exception $e) {
	            return -2;
	        }
    	}
		
		//Crear consulta de optometria
		public function editarConsultaControlOptometria($id_hc, $id_admision, $validar_completa, $anamnesis, $id_ojo, $avsc_lejos_od, $avsc_ph_od,
				$avsc_cerca_od, $avsc_lejos_oi, $avsc_ph_oi, $avsc_cerca_oi, $lenso_esfera_od, $lenso_cilindro_od, $lenso_eje_od, $lenso_lejos_od,
				$lenso_ph_od, $lenso_adicion_od, $lenso_cerca_od, $lenso_esfera_oi, $lenso_cilindro_oi, $lenso_eje_oi, $lenso_lejos_oi, $lenso_ph_oi,
				$lenso_adicion_oi, $lenso_cerca_oi, $querato_k1_od, $querato_ejek1_od, $querato_k2_od, $querato_ejek2_od, $querato_dif_od, $querato_k1_oi,
				$querato_ejek1_oi, $querato_k2_oi, $querato_ejek2_oi, $querato_dif_oi, $cicloplejio_esfera_od, $cicloplejio_cilindro_od, $cicloplejio_eje_od,
				$cicloplejio_lejos_od, $cicloplejio_ph_od, $cicloplejio_adicion_od, $cicloplejio_esfera_oi, $cicloplejio_cilindro_oi, $cicloplejio_eje_oi,
				$cicloplejio_lejos_oi, $cicloplejio_ph_oi, $cicloplejio_adicion_oi, $subjetivo_esfera_od, $subjetivo_cilindro_od, $subjetivo_eje_od,
				$subjetivo_lejos_od, $subjetivo_ph_od, $subjetivo_adicion_od, $subjetivo_cerca_od, $subjetivo_esfera_oi, $subjetivo_cilindro_oi,
				$subjetivo_eje_oi, $subjetivo_lejos_oi, $subjetivo_ph_oi, $subjetivo_adicion_oi, $subjetivo_cerca_oi, $observaciones_avsc,
				$observaciones_queratometria, $observaciones_subjetivo, $observaciones_subjetivo_2, $diagnostico_optometria, $array_diagnosticos,
				$id_usuario, $tipo_guardar) {
			try {
				$sql = "DELETE FROM temporal_diagnosticos
						WHERE id_hc=".$id_hc."
						AND id_usuario=".$id_usuario;
				
				$arrCampos[0] = "@id";
				if ($this->ejecutarSentencia($sql, $arrCampos)) {
					$j = 1;
					foreach ($array_diagnosticos as $fila_diagnosticos) {
						$ciex_diagnostico = $fila_diagnosticos[0];
						$valor_ojos = $fila_diagnosticos[1];
						$sql = "INSERT INTO temporal_diagnosticos (id_hc, id_usuario, cod_ciex, id_ojo, orden)
								VALUES (".$id_hc.", ".$id_usuario.", '".$ciex_diagnostico."', '$valor_ojos', $j)";
						
						$arrCampos[0] = "@id";
	                	$this->ejecutarSentencia($sql, $arrCampos);
						$j++;
					}
				}
				
				$sql = "CALL pa_editar_consultas_control_optometria(".$id_hc.", ".$id_admision.", ".$validar_completa.", '".$anamnesis."', ".$id_ojo.", ".
						$avsc_lejos_od.", ".$avsc_ph_od.", ".$avsc_cerca_od.", ".$avsc_lejos_oi.", ".$avsc_ph_oi.", ".$avsc_cerca_oi.", '".$lenso_esfera_od."', '".
						$lenso_cilindro_od."', '".$lenso_eje_od."', ".$lenso_lejos_od.", ".$lenso_ph_od.", '".$lenso_adicion_od."', ".$lenso_cerca_od.", '".
						$lenso_esfera_oi."', '".$lenso_cilindro_oi."', '".$lenso_eje_oi."', ".$lenso_lejos_oi.", ".$lenso_ph_oi.", '".$lenso_adicion_oi."', ".
						$lenso_cerca_oi.", '".$querato_k1_od."', '".$querato_ejek1_od."', '".$querato_k2_od."', '".$querato_ejek2_od."', '".$querato_dif_od."', '".
						$querato_k1_oi."', '".$querato_ejek1_oi."', '".$querato_k2_oi."', '".$querato_ejek2_oi."', '".$querato_dif_oi."', '".$cicloplejio_esfera_od."', '".
						$cicloplejio_cilindro_od."', '".$cicloplejio_eje_od."', ".$cicloplejio_lejos_od.", ".$cicloplejio_ph_od.", '".$cicloplejio_adicion_od."', '".
						$cicloplejio_esfera_oi."', '".$cicloplejio_cilindro_oi."', '".$cicloplejio_eje_oi."', ".$cicloplejio_lejos_oi.", ".$cicloplejio_ph_oi.", '".
						$cicloplejio_adicion_oi."', '".$subjetivo_esfera_od."', '".$subjetivo_cilindro_od."', '".$subjetivo_eje_od."', ".$subjetivo_lejos_od.", ".
						$subjetivo_ph_od.", '".$subjetivo_adicion_od."', ".$subjetivo_cerca_od.", '".$subjetivo_esfera_oi."', '".$subjetivo_cilindro_oi."', '".
						$subjetivo_eje_oi."', ".$subjetivo_lejos_oi.", ".$subjetivo_ph_oi.", '".$subjetivo_adicion_oi."', ".$subjetivo_cerca_oi.", '".
						$observaciones_avsc."', '".$observaciones_queratometria."', '".$observaciones_subjetivo."', '".$observaciones_subjetivo_2."', '".
						$diagnostico_optometria."', ".$id_usuario.", ".$tipo_guardar.", @id)";
				//echo($sql);
				
				$arrCampos[0] = "@id";
				$arrResultado = $this->ejecutarSentencia($sql, $arrCampos);
				$out_ind_opt=$arrResultado["@id"];
				
				return $out_ind_opt;
				
			} catch (Exception $e) {
				return array();
			}
		}
    }
?>
