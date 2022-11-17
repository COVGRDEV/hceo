<?php
	require_once("DbConexion.php");
	
	class DbPaquetesProcedimientos extends DbConexion {
		
		//Crea el procedimiento
		public function crear_editar_paquete($id_paquete,$nom_paquete, /*$ind_auto_honorarios_medicos, $ind_auto_anestesia, $ind_auto_ayudantia, $ind_auto_derechos_sala,*/ $arr_detalle, $id_usuario, $precio_paquete,$id_convenio,$id_plan) {
			try {
				//Se borra el temporal de detalle de paquetes
				$sql = "DELETE FROM temporal_paquetes_procedimientos_det
						WHERE id_usuario=".$id_usuario;
				
				$this->ejecutarSentencia($sql, array());
				
				foreach ($arr_detalle as $detalle_aux) {
					
					$sql = "";
						
						switch ($detalle_aux["tipo_producto"]) {
						
						case "P":
							$sql = "INSERT INTO temporal_paquetes_procedimientos_det (id_usuario, tipo_producto, cod_procedimiento, ind_bilateralidad, valor)
									VALUES (".$id_usuario.", 'P', '".$detalle_aux["cod_producto"]."',".$detalle_aux["tipo_valor"].", ".$detalle_aux["valor"].")";
							break;
							
						case "I":
							$sql = "INSERT INTO temporal_paquetes_procedimientos_det (id_usuario, tipo_producto, cod_insumo, ind_bilateralidad, valor)
									VALUES (".$id_usuario.", 'I', ".$detalle_aux["cod_producto"].", ".$detalle_aux["tipo_valor"].", ".$detalle_aux["valor"].")";
							break;
						}
					
					if ($sql != "") {
						$this->ejecutarSentencia($sql, array());
					}
				}
				
				if ($id_paquete == ""){
						/*$sql = "CALL pa_crear_paquetes('".$nom_paquete."',  ".$ind_auto_honorarios_medicos.", ".$ind_auto_anestesia.", ".
						$ind_auto_ayudantia.", ".$ind_auto_derechos_sala.", ".$id_usuario.",".$precio_paquete.", @id)";*/
						
						$sql = "CALL pa_crear_paquetes('".$nom_paquete."', ".$id_usuario.",".$precio_paquete.", ".$id_convenio.",".$id_plan.", @id)";
							
				}else{
						/*$sql = "CALL pa_editar_paquetes('".$nom_paquete."', ".$ind_auto_honorarios_medicos.", ".$ind_auto_anestesia.", ".
						$ind_auto_ayudantia.", ".$ind_auto_derechos_sala.", ".$id_usuario.", ".$id_paquete.", ".$precio_paquete.", @id)";	*/
						
						$sql = "CALL pa_editar_paquetes('".$nom_paquete."', ".$id_usuario.", ".$id_paquete.", ".$precio_paquete.", ".$id_convenio.",".$id_plan.", @id)";	
				}
				
				$arrCampos[0] = "@id";
				$arrResultado = $this->ejecutarSentencia($sql, $arrCampos);
				$resultado_out = $arrResultado["@id"];
				
				return $resultado_out;
			} catch (Exception $e) {
				return array();
			}
		}
		//Crea el procedimiento
		public function eliminar_paquete($idPaquete, $Observacion, $usuarioCrea) {
			try {
				$idPaquete == "" ? $idPaquete = "NULL" : $idPaquete = "" . $idPaquete . "";
				$Observacion == "" ? $Observacion = "NULL" : $Observacion = "'" . $Observacion . "'";
				
				$sql = "CALL pa_eliminar_paquete(" . $idPaquete . ", " . $Observacion . ", " . $usuarioCrea . ", @id)";
				
				$arrCampos[0] = "@id";
				$arrResultado = $this->ejecutarSentencia($sql, $arrCampos);
				$resultado_out = $arrResultado["@id"];
				return $resultado_out;
			} catch (Exception $e) {
				return array();
			}
		}
		public function getPaquetes($ind_activo = "") {
			try {
				$sql = "SELECT PP.*, (SELECT COUNT(id_paquete_p_det) FROM paquetes_procedimientos_det WHERE id_paquete_p = PP.id_paquete_p) AS cantProcedimientos
						FROM paquetes_procedimientos PP ";
				if ($ind_activo != "") {
					$sql .= "WHERE PP.ind_estado=".$ind_activo." ";
				}
				$sql .= "ORDER BY PP.ind_estado DESC, PP.nom_paquete_p";
				
				return $this->getDatos($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function buscarPaquetes($param, $ind_activo = "", $id_convenio) {
			try {
				$sql = "SELECT PP.*, (SELECT COUNT(id_paquete_p_det) FROM paquetes_procedimientos_det WHERE id_paquete_p = PP.id_paquete_p) AS cantProcedimientos
						FROM paquetes_procedimientos PP
						WHERE (PP.nom_paquete_p LIKE '%".$param."%'
						OR PP.id_paquete_p='".$param."') ";
				if ($ind_activo != "") {
					$sql .= "AND PP.ind_estado=".$ind_activo." ";
				}
				if($id_convenio <> ""){
					$sql .="AND PP.id_convenio =".$id_convenio." ";
				}
				$sql .= "ORDER BY PP.ind_estado DESC, PP.nom_paquete_p";
				
				return $this->getDatos($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function buscarPaquetesActivos($param) {
			try {
				$sql = "SELECT PP.*, (SELECT COUNT(id_paquete_p_det) FROM paquetes_procedimientos_det WHERE id_paquete_p = PP.id_paquete_p) AS cantProcedimientos
						FROM paquetes_procedimientos PP
						WHERE PP.ind_estado=1
						AND (PP.nom_paquete_p LIKE '%".$param."%'
						OR PP.id_paquete_p='".$param."')
						ORDER BY PP.ind_estado DESC, PP.id_paquete_p DESC;";
				
				return $this->getDatos($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function getPaqueteById($id) {
			try {
				$sql = "SELECT PP.*, COUNT(PPD.id_paquete_p_det) AS cantProcedimientos
						FROM paquetes_procedimientos PP
						INNER JOIN paquetes_procedimientos_det PPD ON PP.id_paquete_p=PPD.id_paquete_p
						WHERE PP.id_paquete_p=".$id;
				
				return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function getProcedimientosByPaquete($id_paquete) {
			try {
				$sql = "SELECT PD.*, UPPER(MP.nombre_procedimiento) AS nombre_procedimiento, UPPER(MI.nombre_insumo) AS nombre_insumo
						FROM paquetes_procedimientos_det PD
						LEFT JOIN maestro_procedimientos MP ON PD.cod_procedimiento=MP.cod_procedimiento
						LEFT JOIN maestro_insumos MI ON PD.cod_insumo=MI.cod_insumo
						WHERE PD.id_paquete_p=".$id_paquete;
				
				return $this->getDatos($sql);
			} catch (Exception $e) {
				return array();
			}
		}

		
	}
?>
