<?php
require_once("DbConexion.php");

class DbPlanes extends DbConexion {
    public function getListaPlanesActivos($id_convenio) {//Plan segun el Convenio
        try {
			$sql = "SELECT P.*, TU.codigo_detalle AS cod_tipo_usuario, TU.nombre_detalle AS tipo_usuario
					FROM planes P
					LEFT JOIN listas_detalle TU ON P.id_tipo_usuario=TU.id_detalle
					WHERE P.id_convenio=".$id_convenio."
					AND P.ind_activo=1
					ORDER BY P.nombre_plan";
			
            return $this->getDatos($sql);
        } catch (Exception $e) {
            return array();
        }
    }
	
    public function getPlan($id_plan) {//Get los datos del plan seleccionado
        try {
            $sql = "SELECT 
						  P.*,
						  TU.codigo_detalle AS cod_tipo_usuario,
						  TU.nombre_detalle AS tipo_usuario,
						  CO.nombre_detalle AS nombre_cobertura 
						FROM
						  planes P 
						  LEFT JOIN listas_detalle TU 
							ON P.id_tipo_usuario = TU.id_detalle 
						  LEFT JOIN listas_detalle CO ON P.cobertura = CO.id_detalle
						WHERE P.id_plan =".$id_plan;
			
            return $this->getUnDato($sql);
        } catch (Exception $e) {
            return array();
        }
    }
    
    public function getPlanByConvenio($id_convenio) {//Get los planes segundo el convenio
        try {
            $sql = "SELECT *
                    FROM planes
                    WHERE id_convenio=".$id_convenio."
					ORDER BY nombre_plan";
			
            return $this->getDatos($sql);
        } catch (Exception $e) {
            return array();
        }
    }
	
	public function getPlanDetalle($id_plan){
		try{
			
			 $sql = "SELECT P.*, TU.codigo_detalle AS cod_tipo_usuario, TU.nombre_detalle AS tipo_usuario, TC.nombre_detalle AS cobertura_nombre, C.nombre_convenio, C.numero_documento
					FROM planes P
					LEFT JOIN listas_detalle TU ON P.id_tipo_usuario=TU.id_detalle
					LEFT JOIN listas_detalle TC ON P.cobertura = TC_id_detalle
					LEFT JOIN convenios C ON P.id_convenio = C.id_convenio
					WHERE P.id_plan=".$id_plan;
		
			return $this->getUnDato($sql);
		}catch(Exception $e){
			return array();
		}
	}
}
?>
