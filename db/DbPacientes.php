<?php
	require_once("DbConexion.php");
	
	class DbPacientes extends DbConexion {
		
		public function getExistepaciente($id_cita, $id_paciente) {//Consulta si en la cita el campo id_paciente existe
			try {
				$sql = "SELECT P.*, DATE_FORMAT(P.fecha_nacimiento, '%d/%m/%Y') AS fecha_nacimiento,
						C.telefono_contacto, C.observacion_cita, CV.nombre_convenio,
						CASE P.status_convenio_paciente
							WHEN 1 THEN 'Activo'
							WHEN 2 THEN 'Inactivo'
							WHEN 3 THEN 'Atención especial'
							WHEN 4 THEN 'Retirado'
							ELSE 'No registrado/No aplica'
						END AS PstatusC
						FROM pacientes P
						INNER JOIN citas C ON C.id_paciente=P.id_paciente
						LEFT JOIN convenios CV ON CV.id_convenio=P.id_convenio_paciente
						WHERE C.id_cita=".$id_cita."
						AND C.id_paciente=".$id_paciente;
				
				//echo($sql);
				return $this->getDatos($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function getExistepaciente2($documento) {//Si en citas el campo id_paciente esta null, Busca por número de documento
			try {
				$sql = "SELECT p.*, DATE_FORMAT(fecha_nacimiento, '%d/%m/%Y') AS fecha_nacimiento_aux, ld.nombre_detalle AS tipodocumento
						FROM pacientes p
						INNER JOIN listas_detalle ld ON ld.id_detalle = p.id_tipo_documento
						WHERE p.numero_documento = (SELECT numero_documento FROM citas WHERE id_cita = $documento) AND 
						p.id_tipo_documento = (SELECT id_tipo_documento FROM citas WHERE id_cita = $documento)";
				
				return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function getExistepaciente3($id_paciente) {//Se busca por id del paciente
			try {
				$sql = "SELECT 
						  p.*,
						  ld.nombre_detalle AS tipodocumento,
						  sx.nombre_detalle AS sexo_t,
						  ps.nombre_pais,
						  pt.nom_dep AS nom_dep_t,
						  m.nom_mun AS nom_mun_t,
						  DATE_FORMAT(fecha_nacimiento, '%d/%m/%Y') AS fecha_nacimiento_aux,
						  fu_calcular_edad (P.fecha_nacimiento, CURDATE()) AS edad,
						  ld.text_adicional_detalle AS codigo_doc_siesa,
						  ps.cod_siesa AS paisCodSiesa,
						  CASE
							p.status_convenio_paciente 
							WHEN 1 
							THEN 'Activo' 
							WHEN 2 
							THEN 'Inactivo' 
							WHEN 3 
							THEN 'Atención especial' 
							WHEN 4 
							THEN 'Retirado' 
							ELSE 'No registrado/No aplica' 
						  END AS PstatusC,
						  tc.nombre_detalle AS tipo_cotizante 
						FROM
						  pacientes p 
						  INNER JOIN listas_detalle ld 
							ON ld.id_detalle = p.id_tipo_documento 
						  LEFT JOIN listas_detalle sx 
							ON p.sexo = sx.id_detalle 
						  LEFT JOIN paises ps 
							ON ps.id_pais = p.id_pais 
						  LEFT JOIN departamentos pt 
							ON pt.cod_dep = p.cod_dep 
						  LEFT JOIN municipios m 
							ON m.cod_mun_dane = p.cod_mun 
						  LEFT JOIN listas_detalle tc 
							ON p.tipo_coti_paciente = tc.id_detalle 
						WHERE p.id_paciente=".$id_paciente;
				//echo $sql;
				return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		//Función que busca todos los pacientes que tengan el número de documento dado ubicando primero el que coincida con el tipo de documento
		public function getExistepaciente4($numero_documento, $id_tipo_documento) {
			try {
				$sql = "SELECT p.*, DATE_FORMAT(fecha_nacimiento, '%d/%m/%Y') AS fecha_nacimiento_aux, ld.nombre_detalle AS tipodocumento
						FROM pacientes p
						INNER JOIN listas_detalle ld ON ld.id_detalle = p.id_tipo_documento
						WHERE p.numero_documento='".$numero_documento."'
						ORDER BY CASE WHEN p.id_tipo_documento=".$id_tipo_documento." THEN 0 ELSE 1 END, p.id_paciente";
				
				return $this->getDatos($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function getBuscarpacientes($parametro) {//Busca pacientes por numero de identificacion o nombre
			return $this->getListaPacientesBusc($parametro, 0);
		}
		
		public function getListaPacientesBusc($parametro, $limite) {
			try {
				$parametro = str_replace(" ", "%", $parametro);
				$sql = "SELECT p.*, ld.nombre_detalle, ps.nombre_pais, pt.nom_dep AS nom_dep2 , m.nom_mun AS nom_mun2,
						DATE_FORMAT(p.fecha_nacimiento, '%d/%m/%Y') AS fecha_nacimiento_aux, LT.nombre_detalle AS tipo_sangre2,
						LT2.nombre_detalle AS factor_rh2, ld.codigo_detalle AS cod_tipo_documento,
						ld.nombre_detalle AS tipo_documento
						FROM pacientes p
						INNER JOIN listas_detalle ld ON ld.id_detalle=p.id_tipo_documento
						LEFT JOIN paises ps ON ps.id_pais=p.id_pais
						LEFT JOIN departamentos pt ON pt.cod_dep=p.cod_dep
						LEFT JOIN municipios m ON m.cod_mun_dane=p.cod_mun
						LEFT JOIN listas_detalle LT ON LT.id_detalle=p.tipo_sangre
						LEFT JOIN listas_detalle LT2 ON LT2.id_detalle=p.factor_rh
						WHERE CONCAT(p.nombre_1, ' ', IFNULL(p.nombre_2, ''), ' ', p.apellido_1, ' ', IFNULL(p.apellido_2, '')) LIKE '%".$parametro."%'
						OR p.numero_documento='".$parametro."'
						ORDER BY p.nombre_1, p.nombre_2, p.apellido_1, p.apellido_2";
				if ($limite > 0) {
					$sql .= " LIMIT ".$limite;
				}
				
				//echo($sql);
				return $this->getDatos($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		//Esta funcion busca el paciente para el formulario Registrar Pago - cuando recibe datos por post
		public function getBuscarPacientesPost($idAdmision) {
			try {
				$sql = "SELECT p.*, ld.nombre_detalle, ps.nombre_pais, pt.nom_dep AS nom_dep2 , m.nom_mun AS nom_mun2,
						DATE_FORMAT(p.fecha_nacimiento, '%d/%m/%Y') AS fecha_nacimiento_aux, LT.nombre_detalle AS tipo_sangre2, LT2.nombre_detalle AS factor_rh2, A.id_plan
						FROM pacientes p
						INNER JOIN listas_detalle ld ON ld.id_detalle = p.id_tipo_documento
						INNER JOIN paises ps ON ps.id_pais = p.id_pais
						LEFT JOIN departamentos pt ON pt.cod_dep = p.cod_dep
						LEFT JOIN municipios m ON m.cod_mun_dane = p.cod_mun
						INNER JOIN listas_detalle LT ON LT.id_detalle = p.tipo_sangre
						INNER JOIN listas_detalle LT2 ON LT2.id_detalle = p.factor_rh
						INNER JOIN admisiones A ON A.id_paciente = p.id_paciente
						WHERE A.id_admision = $idAdmision";
				
				return $this->getDatos($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		//Consulta si el usuario en el evento blur del formulario admisiones cuando este no recibe datos por post
		public function getVerificacionPost($numero_documento, $id_tipo_documento) {
			try {
				$sql = "SELECT P.*, LD.nombre_detalle AS tipodocumento, DATE_FORMAT(P.fecha_nacimiento, '%d/%m/%Y') AS fecha_nacimiento_aux,
						(YEAR(CURDATE())-YEAR(p.fecha_nacimiento))-(RIGHT(CURDATE(), 5)<RIGHT(p.fecha_nacimiento, 5)) AS edad, CON.nombre_convenio as Txtconvenio
						FROM pacientes P
						INNER JOIN listas_detalle LD ON LD.id_detalle=P.id_tipo_documento
						LEFT JOIN convenios CON ON P.id_convenio_paciente=CON.id_convenio
						WHERE P.numero_documento='".$numero_documento."'
						AND P.id_tipo_documento=".$id_tipo_documento;
				
				//echo $sql;
				return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function getPacienteNumeroDocumento($numero_documento) {
			try {
				$sql = "SELECT P.*, LD.nombre_detalle AS tipodocumento, DATE_FORMAT(P.fecha_nacimiento, '%d/%m/%Y') AS fecha_nacimiento_aux
						FROM pacientes P
						INNER JOIN listas_detalle LD ON LD.id_detalle=P.id_tipo_documento
						WHERE P.numero_documento='".$numero_documento."'";
				
				return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function getEdadPaciente($id_paciente, $fecha) {
			try {
				if ($fecha == "") {
					$fecha = "CURDATE()";
				} else {
					$fecha = "'".$fecha."'";	
				}
				$sql = "SELECT p.*, (YEAR(".$fecha.")-YEAR(p.fecha_nacimiento))-(RIGHT(".$fecha.", 5)<RIGHT(p.fecha_nacimiento, 5)) AS edad,
						SX.nombre_detalle AS sexo_t, DATE_FORMAT(p.fecha_nacimiento, '%d/%m/%Y') AS fecha_nacimiento_t,
						EC.nombre_detalle AS estado_civil, pa_res.nombre_pais as pais_res, dep_res.nom_dep AS dept_res, mun_res.nom_mun AS muni_res,
						pa_nac.nombre_pais AS pais_nac, dep_nac.nom_dep AS dept_nac, mun_nac.nom_mun AS muni_nac, TD.nombre_detalle AS tipo_documento
						FROM pacientes p
						LEFT JOIN listas_detalle SX ON p.sexo=SX.id_detalle
						LEFT JOIN listas_detalle EC ON p.id_estado_civil=EC.id_detalle
						LEFT JOIN listas_detalle TD ON p.id_tipo_documento=TD.id_detalle
						LEFT JOIN paises pa_res ON p.id_pais=pa_res.id_pais
						LEFT JOIN departamentos dep_res ON p.cod_dep=dep_res.cod_dep
						LEFT JOIN municipios mun_res ON p.cod_mun=mun_res.cod_mun_dane
						LEFT JOIN paises pa_nac ON p.id_pais_nac=pa_nac.id_pais
						LEFT JOIN departamentos dep_nac ON p.cod_dep_nac=dep_nac.cod_dep
						LEFT JOIN municipios mun_nac ON p.cod_mun_nac=mun_nac.cod_mun_dane
						WHERE p.id_paciente=".$id_paciente;
					//echo $sql;
				return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function insertarTemporalHuella($id_usuario, $nombre_arch) {
			try {
				//Se borra el registro del usuario
				$sql = "DELETE FROM temporal_huella
						WHERE id_usuario=".$id_usuario;
				
				$this->ejecutarSentencia($sql, array());
				
				$sql = "INSERT INTO temporal_huella
						(id_usuario, huella)
						VALUES (".$id_usuario.", '".mysql_escape_string(file_get_contents($nombre_arch))."')";
				
				$this->ejecutarSentencia($sql, array());
				
				return 1;
			} catch (Exception $e) {
				return -2;
			}
		}
		
		public function getTemporalHuella($id_usuario) {
			try {
				$sql = "SELECT *
						FROM temporal_huella
						WHERE id_usuario=".$id_usuario;
				
				return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function deleteTemporalHuella($id_usuario) {
			try {
				$sql = "DELETE FROM temporal_huella
						WHERE id_usuario =".$id_usuario;
				
				$this->ejecutarSentencia($sql, array());
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function getPaciente($id_paciente, $fecha = "") {
			try {
				if (trim($fecha == "")) {
					$fecha = "CURDATE()";
				} else {
					$fecha = "'".$fecha."'";
				}
				$sql = "SELECT P.*, TD.nombre_detalle AS tipo_documento, TS.nombre_detalle AS tipo_sangre_t,
						RH.nombre_detalle AS factor_rh_t, SX.nombre_detalle AS sexo_t, PA.nombre_pais, D.nom_dep AS nom_dep_t,
						M.nom_mun AS nom_mun_t, fu_calcular_edad(P.fecha_nacimiento, ".$fecha.") AS edad,
						DATE_FORMAT(P.fecha_nacimiento, '%d/%m/%Y') AS fecha_nacimiento_t, EC.nombre_detalle AS estado_civil,
						PN.nombre_pais AS nombre_pais_nac, DN.nom_dep AS nom_dep_nac_t, MN.nom_mun AS nom_mun_nac_t, TD.codigo_detalle AS codigoDocumento,
						SX.codigo_detalle AS codigoSexo, fu_calcular_edad(fecha_nacimiento,curdate()) AS edad, C.nombre_convenio
						FROM pacientes P
						LEFT JOIN listas_detalle TD ON P.id_tipo_documento=TD.id_detalle
						LEFT JOIN listas_detalle TS ON P.tipo_sangre=TS.id_detalle
						LEFT JOIN listas_detalle RH ON P.factor_rh=RH.id_detalle
						LEFT JOIN listas_detalle SX ON P.sexo=SX.id_detalle
						LEFT JOIN listas_detalle EC ON P.id_estado_civil=EC.id_detalle
						LEFT JOIN paises PA ON P.id_pais=PA.id_pais
						LEFT JOIN departamentos D ON P.cod_dep=D.cod_dep
						LEFT JOIN municipios M ON P.cod_mun=M.cod_mun_dane
						LEFT JOIN paises PN ON P.id_pais_nac=PN.id_pais
						LEFT JOIN departamentos DN ON P.cod_dep_nac=DN.cod_dep
						LEFT JOIN municipios MN ON P.cod_mun_nac=MN.cod_mun_dane
						LEFT JOIN convenios C ON P.id_convenio_paciente = C.id_convenio
						WHERE P.id_paciente=".$id_paciente;
				
				return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			} 
		}
		
		public function crear_editar_paciente($id_paciente, $id_tipo_documento, $numero_documento, $nombre_1, $nombre_2, $apellido_1,
				$apellido_2, $direccion, $id_pais, $cod_dep, $cod_mun, $nom_dep, $nom_mun, $telefono_1, $telefono_2, $id_usuario, $email="", $tipo_paciente="") {
			try {
				if ($id_paciente == "") {
					$id_paciente = "NULL";
				}
				if ($nombre_2 == "") {
					$nombre_2 = "NULL";
				} else {
					$nombre_2 = "'".$nombre_2."'";
				}
				if ($apellido_2 == "") {
					$apellido_2 = "NULL";
				} else {
					$apellido_2 = "'".$apellido_2."'";
				}
				if ($cod_dep == "") {
					$cod_dep = "NULL";
				} else {
					$cod_dep = "'".$cod_dep."'";
				}
				if ($cod_mun == "") {
					$cod_mun = "NULL";
				} else {
					$cod_mun = "'".$cod_mun."'";
				}
				if ($nom_dep == "") {
					$nom_dep = "NULL";
				} else {
					$nom_dep = "'".$nom_dep."'";
				}
				if ($nom_mun == "") {
					$nom_mun = "NULL";
				} else {
					$nom_mun = "'".$nom_mun."'";
				}
				if ($telefono_2 == "") {
					$telefono_2 = "NULL";
				} else {
					$telefono_2 = "'".$telefono_2."'";
				}
				if ($email == "") {
					$email = "NULL";
				} else {
					$email = "'".$email."'";
				}
				if ($tipo_paciente == "") {
					$tipo_paciente = "NULL";
				} else {
					$tipo_paciente = "'".$tipo_paciente."'";
				}
						
				$sql = "CALL pa_crear_editar_paciente(".$id_paciente.", ".$id_tipo_documento.", '".$numero_documento."', '".$nombre_1."', ".
						$nombre_2.", '".$apellido_1."', ".$apellido_2.", '".$direccion."', ".$id_pais.", ".$cod_dep.", ".$cod_mun.", ".
						$nom_dep.", ".$nom_mun.", '".$telefono_1."', ".$telefono_2.", ".$id_usuario.", ".$email.",1, ".$tipo_paciente.", @id)";
				
				
				$arrCampos[0] = "@id";
				$arrResultado = $this->ejecutarSentencia($sql, $arrCampos);
				$resultado_out = $arrResultado["@id"];
	
				return $resultado_out;
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function editar_paciente($id_paciente, $id_tipo_documento, $numero_documento, $nombre_1, $nombre_2, $apellido_1, $apellido_2, $sexo, $fecha_nacimiento,
				$tipo_sangre, $factor_rh, $id_pais_nac, $cod_dep_nac, $cod_mun_nac, $nom_dep_nac, $nom_mun_nac, $id_pais, $cod_dep, $cod_mun, $nom_dep, $nom_mun, $id_zona,$direccion, $email, $telefono_1, $telefono_2, $profesion, $id_estado_civil, $ind_desplazado, $id_etnia, $id_usuario, $observ_paciente = "", $ind_habeas_data="",$convenio = "", $estado_convenio = "", $exento = "", $rango = "", $tipoUsuario = "") {
			try {
				if ($id_pais_nac == "1") {
					$nom_dep_nac = "";
					$nom_mun_nac = "";
				} else {
					$cod_dep_nac = "";
					$cod_mun_nac = "";
				}
				if ($id_pais == "1") {
					$nom_dep = "";
					$nom_mun = "";
				} else {
					$cod_dep = "";
					$cod_mun = "";
				}
				$nombre_2 == "" ? $nombre_2 = "NULL" : $nombre_2 = "'".$nombre_2."'";
				$apellido_2 == "" ? $apellido_2 = "NULL" : $apellido_2 = "'".$apellido_2."'";
				$cod_dep_nac == "" ? $cod_dep_nac = "NULL" : $cod_dep_nac = "'".$cod_dep_nac."'";
				$cod_mun_nac == "" ? $cod_mun_nac = "NULL" : $cod_mun_nac = "'".$cod_mun_nac."'";
				$nom_dep_nac == "" ? $nom_dep_nac = "NULL" : $nom_dep_nac = "'".$nom_dep_nac."'";
				$nom_mun_nac == "" ? $nom_mun_nac = "NULL" : $nom_mun_nac = "'".$nom_mun_nac."'";
				$cod_dep == "" ? $cod_dep = "NULL" : $cod_dep = "'".$cod_dep."'";
				$cod_mun == "" ? $cod_mun = "NULL" : $cod_mun = "'".$cod_mun."'";
				$nom_dep == "" ? $nom_dep = "NULL" : $nom_dep = "'".$nom_dep."'";
				$nom_mun == "" ? $nom_mun = "NULL" : $nom_mun = "'".$nom_mun."'";
				$telefono_2 == "" ? $telefono_2 = "NULL" : $telefono_2 = "'".$telefono_2."'";
				$email == "" ? $email = "NULL" : $email = "'".$email."'";
				$observ_paciente == "" ? $observ_paciente = "NULL" : $observ_paciente = "'".$observ_paciente."'";
				$ind_habeas_data == "" ? $ind_habeas_data = "NULL" : $ind_habeas_data = " ".$ind_habeas_data."";
				
				if ($ind_desplazado == "") {
					$ind_desplazado = "NULL";
				}
				if ($id_etnia == "") {
					$id_etnia = "NULL";
				}
				if ($convenio == "") {
					$convenio = "NULL";
				}
				if ($estado_convenio == "") {
					$estado_convenio = "NULL";
				}
				if ($exento == "") {
					$exento = "NULL";
				}
				if ($rango == "") {
					$rango = "NULL";
				}
				if ($tipoUsuario == "") {
					$tipoUsuario = "NULL";
				}
				
				$sql = "CALL pa_editar_paciente(".$id_paciente.", ".$id_tipo_documento.", '".$numero_documento."', '".$nombre_1."', ".$nombre_2.", '".
						$apellido_1."', ".$apellido_2.", '".$sexo."', STR_TO_DATE('".$fecha_nacimiento."', '%d/%m/%Y'), ".$tipo_sangre.", ".$factor_rh.", ".
						$id_pais_nac.", ".$cod_dep_nac.", ".$cod_mun_nac.", ".$nom_dep_nac.", ".$nom_mun_nac.", ".$id_pais.", ".$cod_dep.", ".$cod_mun.", ".
						$nom_dep.", ".$nom_mun.", ".$id_zona.", '".$direccion."', ".$email.", '".$telefono_1."', ".$telefono_2.", '".$profesion."', ".
						$id_estado_civil.", ".$ind_desplazado.", ".$id_etnia.", ".$observ_paciente.", 1, ".$id_usuario.", ".$convenio.", ".
						$estado_convenio.", ".$exento.", ".$rango.", ".$tipoUsuario.",".$ind_habeas_data.", @id)";
						
				echo($sql);
			
				$arrCampos[0] = "@id";
				$arrResultado = $this->ejecutarSentencia($sql, $arrCampos);
				$resultado_out = $arrResultado["@id"];
	
				return $resultado_out;
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function guardar_clave_verificacion($id_usuario, $clave_verificacion) {
			try {
				$sql = "UPDATE pacientes SET clave_verificacion = '".$clave_verificacion."' WHERE id_paciente = ".$id_usuario." ";
				
				$this->ejecutarSentencia($sql, array());
				
				return 1;
			} catch (Exception $e) {
				return -2;
			}
		}
		
		public function validarIngresoResultados($documento, $clave) {
			try {
				$sql = "SELECT * FROM pacientes WHERE numero_documento = $documento AND clave_verificacion = $clave";
				
				$arrResultado = $this->getUnDato($sql);
				
				if (count($arrResultado) <= 0) {  
					$sql = "SELECT 0 AS id_paciente, NULL AS nombre_1, NULL AS nombre_2, NULL AS apellido_1, NULL AS apellido_2";
					
					$arrResultado = $this->getUnDato($sql);
				}
				
				return $arrResultado;
			} catch (Exception $e) {
				return array();
			}
		}
		
		/**
		 * Tipo de formato:
		 * 1 - dd/mm/yyyy
		 * 2 - yyyy-mm-dd
		 **/
		public function getEdad($fecha_nacimiento, $fecha_base, $tipo_formato) {
			try {
				$formato = "";
				switch ($tipo_formato) {
					case 1: //dd/mm/yyyy
						$formato = "%d/%m/%Y";
						break;
					case 2: //yyyy-mm-dd
						$formato = "%Y-%m-%d";
						break;
				}
				if ($fecha_base != "") {
					$fecha_base = "STR_TO_DATE('".$fecha_base."', '".$formato."')";	
				} else {
					$fecha_base = "CURDATE()";
				}
				$sql = "SELECT fu_calcular_edad(STR_TO_DATE('".$fecha_nacimiento."', '".$formato."'), ".$fecha_base.") AS edad";
				//echo($sql);
				return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function getEdad_HC($fecha_nacimiento, $fecha_base) {
			
			try {
				if ($fecha_base != "") {
					$fecha_base = "STR_TO_DATE('".$fecha_base."', '%Y-%m-%d')";	
				} else {
					$fecha_base = "CURDATE()";
				}
				$sql = "SELECT fu_calcular_edad(STR_TO_DATE('".$fecha_nacimiento."', '%Y-%m-%d'), ".$fecha_base.") AS edad";
				
				return $this->getUnDato($sql);
				
			} catch (Exception $e) {
				return array();
			}
		}
		
		
		public function crear_paciente($id_tipo_documento, $numero_documento, $nombre_1, $nombre_2, $apellido_1, $apellido_2, $sexo, $fecha_nacimiento,
				$tipo_sangre, $factor_rh, $id_pais_nac, $cod_dep_nac, $cod_mun_nac, $nom_dep_nac, $nom_mun_nac, $id_pais, $cod_dep, $cod_mun, $nom_dep, $nom_mun, $id_zona,
				$direccion, $email, $telefono_1, $telefono_2, $profesion, $id_estado_civil, $ind_desplazado, $id_etnia, $id_usuario, $observ_paciente = "") {
			try {
				if ($nombre_2 == "") {
					$nombre_2 = "NULL";
				} else {
					$nombre_2 = "'".$nombre_2."'";
				}
				if ($apellido_2 == "") {
					$apellido_2 = "NULL";
				} else {
					$apellido_2 = "'".$apellido_2."'";
				}
				if ($id_pais_nac == "1") {
					$nom_dep_nac = "";
					$nom_mun_nac = "";
				} else {
					$cod_dep_nac = "";
					$cod_mun_nac = "";
				}
				if ($cod_dep_nac == "") {
					$cod_dep_nac = "NULL";
				} else {
					$cod_dep_nac = "'".$cod_dep_nac."'";
				}
				if ($cod_mun_nac == "") {
					$cod_mun_nac = "NULL";
				} else {
					$cod_mun_nac = "'".$cod_mun_nac."'";
				}
				if ($nom_dep_nac == "") {
					$nom_dep_nac = "NULL";
				} else {
					$nom_dep_nac = "'".$nom_dep_nac."'";
				}
				if ($nom_mun_nac == "") {
					$nom_mun_nac = "NULL";
				} else {
					$nom_mun_nac = "'".$nom_mun_nac."'";
				}
				if ($id_pais == "1") {
					$nom_dep = "";
					$nom_mun = "";
				} else {
					$cod_dep = "";
					$cod_mun = "";
				}
				if ($cod_dep == "") {
					$cod_dep = "NULL";
				} else {
					$cod_dep = "'".$cod_dep."'";
				}
				if ($cod_mun == "") {
					$cod_mun = "NULL";
				} else {
					$cod_mun = "'".$cod_mun."'";
				}
				if ($nom_dep == "") {
					$nom_dep = "NULL";
				} else {
					$nom_dep = "'".$nom_dep."'";
				}
				if ($nom_mun == "") {
					$nom_mun = "NULL";
				} else {
					$nom_mun = "'".$nom_mun."'";
				}
				if ($telefono_2 == "") {
					$telefono_2 = "NULL";
				} else {
					$telefono_2 = "'".$telefono_2."'";
				}
				if ($email == "") {
					$email = "NULL";
				} else {
					$email = "'".$email."'";
				}
				if ($ind_desplazado == "") {
					$ind_desplazado = "NULL";
				}
				if ($id_etnia == "") {
					$id_etnia = "NULL";
				}
				if ($observ_paciente == "") {
					$observ_paciente = "NULL";
				} else {
					$observ_paciente = "'".$observ_paciente."'";
				}
				
				$sql = "CALL pa_crear_paciente(".$id_tipo_documento.", '".$numero_documento."', '".$nombre_1."', ".$nombre_2.", '".
						$apellido_1."', ".$apellido_2.", '".$sexo."', STR_TO_DATE('".$fecha_nacimiento."', '%d/%m/%Y'), ".$tipo_sangre.", ".$factor_rh.", ".
						$id_pais_nac.", ".$cod_dep_nac.", ".$cod_mun_nac.", ".$nom_dep_nac.", ".$nom_mun_nac.", ".$id_pais.", ".$cod_dep.", ".$cod_mun.", ".
						$nom_dep.", ".$nom_mun.", ".$id_zona.", '".$direccion."', ".$email.", '".$telefono_1."', ".$telefono_2.", '".$profesion."', ".
						$id_estado_civil.", ".$ind_desplazado.", ".$id_etnia.", ".$observ_paciente.", 1, ".$id_usuario.", @id)";
				//echo($sql);
				
				$arrCampos[0] = "@id";
				$arrResultado = $this->ejecutarSentencia($sql, $arrCampos);
				$resultado_out = $arrResultado["@id"];
	
				return $resultado_out;
			} catch (Exception $e) {
				return array();
			}
		}
		
		//Función que obtiene los datos del paciente y el estado del mismo para un convenio dado
		public function getPacienteEstadoConvenio($id_paciente, $id_convenio) {
			try {
				$sql = "SELECT P.*, CASE WHEN P.id_convenio_paciente=".$id_convenio."
							THEN P.status_convenio_paciente
							ELSE NULL
						END AS status_convenio, CASE WHEN P.id_convenio_paciente=".$id_convenio."
							THEN
								CASE P.status_convenio_paciente
									WHEN 1 THEN 'Activo'
									WHEN 2 THEN 'Inactivo'
									WHEN 3 THEN 'Atención especial'
									WHEN 4 THEN 'Retirado'
									ELSE 'No registrado/No aplica'
								END
							ELSE 'No registrado/No aplica'
						END AS PstatusC
						FROM pacientes P
						WHERE P.id_paciente=".$id_paciente;
				
				//echo $sql;
				return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			}
		}
		
		public function getPacienteDetalle($id_paciente){
			try {
			
			$sql = "SELECT P.*, LD.codigo_detalle FROM pacientes P
					LEFT JOIN listas_detalle LD ON  P.id_tipo_documento = LD.id_detalle
					WHERE P.id_paciente =".$id_paciente;
					
			return $this->getUnDato($sql);
			} catch (Exception $e) {
				return array();
			}	
			
	}
		
	}
?>
