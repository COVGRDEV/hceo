<?php
	require_once("DbConexion.php");
	
	class DbMaestroMedicamentos extends DbConexion {
		/*
		 * Esta funcion obtiene listado de servicios segun la variable $parametro
		 */
		public function getMedicamentos($parametro) {
			try {
				$parametro = str_replace(" ", "%", $parametro);
				
				$sql = "SELECT *, CONCAT(nombre_generico, ' - ', nombre_comercial) AS nombre_aux
						FROM maestro_medicamentos
						WHERE nombre_generico LIKE '%".$parametro."%'
						OR nombre_comercial LIKE '%".$parametro."%'
						OR cod_medicamento='".$parametro."'
						LIMIT 100";
				
				return $this->getDatos($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		/**
		 * cod_tipo_medicamento
		 * 1 - Genéricos
		 * 2 - Comerciales
		 **/
		public function getListaMedicamentosNombreTipo($ind_activo, $cod_tipo_medicamento, $id_lugar_cita = "") {
			try {
				$sql = "";
				
				if ($cod_tipo_medicamento == "1" || $cod_tipo_medicamento == "") {
					$sql = "SELECT MIN(cod_medicamento) AS cod_medicamento, CONCAT(nombre_generico, ' (GENÉRICO)') AS nombre_medicamento, presentacion,
							grupo_terapeutico, NULL AS laboratorio, 1 AS cod_tipo_medicamento, MAX(precio - costo) AS utilidad
							FROM maestro_medicamentos
							WHERE id_convenio IS NULL
							AND id_plan IS NULL ";
					if ($id_lugar_cita != "") {
						$sql .= "AND IFNULL(id_lugar_cita, ".$id_lugar_cita.")=".$id_lugar_cita." ";
					} else {
						$sql .= "AND id_lugar_cita IS NULL ";
					}
					if ($ind_activo != "") {
						$sql .= "AND ind_activo=".$ind_activo." ";
					}
					$sql .= "GROUP BY nombre_generico, presentacion, grupo_terapeutico ";
				}
				
				if ($cod_tipo_medicamento == "2" || $cod_tipo_medicamento == "") {
					if ($sql != "") {
						$sql .= "UNION ALL ";
					}
					$sql .= "SELECT MIN(cod_medicamento) AS cod_medicamento, CONCAT(nombre_comercial, ' (', nombre_generico, ')') AS nombre_medicamento, presentacion,
							grupo_terapeutico, laboratorio, 2 AS cod_tipo_medicamento, MAX(precio - costo) AS utilidad
							FROM maestro_medicamentos
							WHERE id_convenio IS NULL
							AND id_plan IS NULL ";
					if ($id_lugar_cita != "") {
						$sql .= "AND IFNULL(id_lugar_cita, ".$id_lugar_cita.")=".$id_lugar_cita." ";
					} else {
						$sql .= "AND id_lugar_cita IS NULL ";
					}
					if ($ind_activo != "") {
						$sql .= "AND ind_activo=".$ind_activo." ";
					}
					$sql .= "GROUP BY nombre_comercial, nombre_generico, presentacion, grupo_terapeutico, laboratorio ";
				}
				$sql .= "ORDER BY utilidad DESC, cod_tipo_medicamento DESC, nombre_medicamento, presentacion";
				
				return $this->getDatos($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		/**
		 * cod_tipo_medicamento
		 * 1 - Genéricos
		 * 2 - Comerciales
		 **/
		public function getListaMedicamentosConvenioPlan($ind_activo, $cod_tipo_medicamento, $id_convenio, $id_plan, $id_lugar_cita = "") {
			try {
				$sql = "";
				
				if ($cod_tipo_medicamento == "1" || $cod_tipo_medicamento == "") {
					$sql = "SELECT MIN(cod_medicamento) AS cod_medicamento, CONCAT(nombre_generico, ' (GENÉRICO)') AS nombre_medicamento, presentacion,
							grupo_terapeutico, NULL AS laboratorio, 1 AS cod_tipo_medicamento, MAX(precio - costo) AS utilidad
							FROM maestro_medicamentos
							WHERE id_convenio=".$id_convenio."
							AND IFNULL(id_plan, ".$id_plan.")=".$id_plan." ";
					if ($id_lugar_cita != "") {
						$sql .= "AND IFNULL(id_lugar_cita, ".$id_lugar_cita.")=".$id_lugar_cita." ";
					} else {
						$sql .= "AND id_lugar_cita IS NULL ";
					}
					if ($ind_activo != "") {
						$sql .= "AND ind_activo=".$ind_activo." ";
					}
					$sql .= "GROUP BY nombre_generico, presentacion, grupo_terapeutico ";
				}
				
				if ($cod_tipo_medicamento == "2" || $cod_tipo_medicamento == "") {
					if ($sql != "") {
						$sql .= "UNION ALL ";
					}
					$sql .= "SELECT MIN(cod_medicamento) AS cod_medicamento, CONCAT(nombre_comercial, ' (', nombre_generico, ')') AS nombre_medicamento, presentacion,
							grupo_terapeutico, laboratorio, 2 AS cod_tipo_medicamento, MAX(precio - costo) AS utilidad
							FROM maestro_medicamentos
							WHERE id_convenio=".$id_convenio."
							AND IFNULL(id_plan, ".$id_plan.")=".$id_plan." ";
					if ($id_lugar_cita != "") {
						$sql .= "AND IFNULL(id_lugar_cita, ".$id_lugar_cita.")=".$id_lugar_cita." ";
					} else {
						$sql .= "AND id_lugar_cita IS NULL ";
					}
					if ($ind_activo != "") {
						$sql .= "AND ind_activo=".$ind_activo." ";
					}
					$sql .= "GROUP BY nombre_comercial, nombre_generico, presentacion, grupo_terapeutico, laboratorio ";
				}
				$sql .= "ORDER BY utilidad DESC, cod_tipo_medicamento DESC, nombre_medicamento, presentacion";
				
				//echo($sql);
				return $this->getDatos($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		//Función que retorna un medicamento por su código
		public function getMedicamento($cod_medicamento) {
			try {
				$sql = "SELECT *
						FROM maestro_medicamentos
						WHERE cod_medicamento='".$cod_medicamento."'";
				
				return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function crear_medicamento($nombre_generico, $nombre_comercial, $presentacion, $concentracion,
				$grupo_terapeutico, $laboratorio, $ind_pos, $id_lugar_cita, $id_usuario) {
			try {
				if ($concentracion == "") {
					$concentracion = "NULL";
				} else {
					$concentracion = "'".$concentracion."'";
				}
				if ($grupo_terapeutico == "") {
					$grupo_terapeutico = "NULL";
				} else {
					$grupo_terapeutico = "'".$grupo_terapeutico."'";
				}
				if ($laboratorio == "") {
					$laboratorio = "NULL";
				} else {
					$laboratorio = "'".$laboratorio."'";
				}
				if ($id_lugar_cita == "") {
					$id_lugar_cita = "NULL";
				}
				
				$sql = "CALL pa_crear_medicamento('".$nombre_generico."', '".$nombre_comercial."', '".$presentacion."', ".$concentracion.", ".
						$grupo_terapeutico.", ".$laboratorio.", ".$ind_pos.", ".$id_lugar_cita.", ".$id_usuario.", @id)";
				//echo($sql)."<br />";
				
				$arrCampos[0] = "@id";
				$arrResultado = $this->ejecutarSentencia($sql, $arrCampos);
				$resultado = $arrResultado["@id"];
	
				return $resultado;
			} catch (Exception $e) {
				return -2;
			}
		}
	}
?>
